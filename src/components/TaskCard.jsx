import useTaskStore from '../store/useTaskStore.js'
import { STATUSES, STATUS_COLORS, PRIORITY_COLORS } from '../types.js'
import { cn } from '../lib/cn.js'

export function TaskCard({ task }) {
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  const formattedDate = new Date(task.fechaActualizacion).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800 leading-snug">{task.nombre}</h3>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-slate-300 hover:text-red-400 transition-colors shrink-0 text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', PRIORITY_COLORS[task.prioridad])}>
          {task.prioridad}
        </span>
        <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
          {task.owner}
        </span>
      </div>

      {task.descripcion && (
        <p className="text-xs text-slate-500 line-clamp-2">{task.descripcion}</p>
      )}

      <div className="pt-1 border-t border-slate-100">
        <label className="block text-xs text-slate-400 mb-1">Estado</label>
        <select
          value={task.estado}
          onChange={(e) => updateStatus(task.id, e.target.value)}
          className={cn(
            'w-full text-xs font-medium rounded-lg px-2 py-1.5 border-0 outline-none cursor-pointer',
            STATUS_COLORS[task.estado]
          )}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-slate-400">Actualizado: {formattedDate}</p>
    </div>
  )
}
