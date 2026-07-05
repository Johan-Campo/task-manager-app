import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'

import useTaskStore from '../store/useTaskStore.js'
import { STATUSES, PRIORITY_COLORS, PRIORITY_BORDER, KANBAN_BORDER_COLORS } from '../types.js'
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
      className={cn(
        'border border-l-[3px] rounded-xl select-none transition-all duration-150',
        PRIORITY_BORDER[task.prioridad],
        isDragging
          ? 'opacity-25 shadow-none bg-slate-50 border-slate-100 cursor-grabbing'
          : 'bg-slate-50 hover:bg-violet-50/60 border-slate-100 hover:border-violet-100'
      )}
    >
      <div className="flex items-start gap-1.5 p-2.5">
        <button
          {...listeners}
          {...attributes}
          className="mt-0.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0 touch-none"
        >
          <GripVertical size={13} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-700 leading-snug mb-1.5">{task.nombre}</p>
          <div className="flex items-center gap-1.5">
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md', PRIORITY_COLORS[task.prioridad])}>
              {task.prioridad}
            </span>
            <span className="text-[11px] text-slate-400 truncate">{task.owner}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function KanbanCardOverlay({ task }) {
  return (
    <div className={cn('bg-white border border-l-[3px] rounded-xl shadow-2xl shadow-violet-100 rotate-1 cursor-grabbing scale-105', PRIORITY_BORDER[task.prioridad])}>
      <div className="flex items-start gap-1.5 p-2.5">
        <GripVertical size={13} className="mt-0.5 text-slate-300 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-700 leading-snug mb-1.5">{task.nombre}</p>
          <div className="flex items-center gap-1.5">
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md', PRIORITY_COLORS[task.prioridad])}>
              {task.prioridad}
            </span>
            <span className="text-[11px] text-slate-400 truncate">{task.owner}</span>
          </div>
        </div>
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
          <>
            {tasks.map((task) => <KanbanCard key={task.id} task={task} />)}
            {isOver && (
              <div className="border-2 border-dashed border-violet-300 bg-violet-50/60 rounded-xl min-h-[52px]" />
            )}
          </>
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
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
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
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
        <div className="grid grid-cols-5 gap-3 min-w-[700px]">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.estado === status)}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTask ? <KanbanCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
