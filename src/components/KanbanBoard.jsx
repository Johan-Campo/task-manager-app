import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import useTaskStore from '../store/useTaskStore.js'
import { STATUSES, PRIORITY_COLORS, KANBAN_BORDER_COLORS } from '../types.js'
import { cn } from '../lib/cn.js'

function KanbanCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'border rounded-xl p-2.5 select-none transition-all duration-150',
        isDragging
          ? 'opacity-25 shadow-none bg-slate-50 border-slate-100 cursor-grabbing'
          : 'bg-slate-50 hover:bg-violet-50/60 border-slate-100 hover:border-violet-100 cursor-grab'
      )}
    >
      <p className="text-xs font-semibold text-slate-700 leading-snug mb-1.5">{task.nombre}</p>
      <div className="flex items-center gap-1.5">
        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md', PRIORITY_COLORS[task.prioridad])}>
          {task.prioridad}
        </span>
        <span className="text-[11px] text-slate-400 truncate">{task.owner}</span>
      </div>
    </div>
  )
}

function KanbanCardOverlay({ task }) {
  return (
    <div className="bg-white border border-violet-300 rounded-xl p-2.5 shadow-2xl shadow-violet-100 rotate-1 cursor-grabbing scale-105">
      <p className="text-xs font-semibold text-slate-700 leading-snug mb-1.5">{task.nombre}</p>
      <div className="flex items-center gap-1.5">
        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md', PRIORITY_COLORS[task.prioridad])}>
          {task.prioridad}
        </span>
        <span className="text-[11px] text-slate-400 truncate">{task.owner}</span>
      </div>
    </div>
  )
}

function KanbanColumn({ status, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'border border-t-2 rounded-2xl p-3 shadow-sm transition-all duration-200 min-h-24',
        KANBAN_BORDER_COLORS[status],
        isOver ? 'bg-violet-50/50 border-violet-200 shadow-md' : 'bg-white border-slate-200/80'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-700">{status}</span>
        <span className="min-w-5 h-5 px-1.5 bg-slate-100 rounded-full text-[11px] font-bold text-slate-500 flex items-center justify-center">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div
            className={cn(
              'py-5 text-center text-xs rounded-xl border-2 border-dashed transition-all duration-200',
              isOver
                ? 'border-violet-300 text-violet-500 bg-violet-50'
                : 'border-slate-100 text-slate-300'
            )}
          >
            {isOver ? 'Suelta aquí' : 'Vacío'}
          </div>
        ) : (
          tasks.map((task) => <KanbanCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}

export function KanbanBoard() {
  const tasks = useTaskStore((s) => s.tasks)
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null)
  }

  const handleDragEnd = ({ active, over }) => {
    if (over) {
      const task = tasks.find((t) => t.id === active.id)
      if (task && task.estado !== over.id) {
        updateStatus(active.id, over.id)
      }
    }
    setActiveTask(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.estado === status)}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTask ? <KanbanCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
