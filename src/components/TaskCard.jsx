import { User, Calendar, Trash2 } from 'lucide-react'
import useTaskStore from '../store/useTaskStore.js'
import { STATUSES, STATUS_COLORS, PRIORITY_COLORS } from '../types.js'
import { cn } from '../lib/cn.js'

const PRIORITY_BORDER = {
  Alta: 'border-l-red-500',
  Media: 'border-l-amber-400',
  Baja: 'border-l-slate-300',
}

export function TaskCard({ task }) {
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  const formattedDate = new Date(task.fechaActualizacion).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div
      className={cn(
        'group bg-white rounded-2xl border border-slate-200 border-l-4 p-4 flex flex-col gap-3',
        'shadow-sm hover:shadow-md transition-all duration-200',
        PRIORITY_BORDER[task.prioridad]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800 leading-snug">{task.nombre}</h3>
        <button
          onClick={() => deleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 hover:bg-red-50 p-1 rounded-lg transition-all shrink-0"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-md', PRIORITY_COLORS[task.prioridad])}>
          {task.prioridad}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <User size={11} className="text-slate-400" />
          {task.owner}
        </span>
      </div>

      {task.descripcion && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{task.descripcion}</p>
      )}

      <div className="mt-auto pt-3 border-t border-slate-100">
        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Estado
        </label>
        <select
          value={task.estado}
          onChange={(e) => updateStatus(task.id, e.target.value)}
          className={cn(
            'w-full text-xs font-semibold rounded-xl px-2.5 py-1.5 border-0 outline-none cursor-pointer transition-colors',
            STATUS_COLORS[task.estado]
          )}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-slate-400">
        <Calendar size={11} />
        {formattedDate}
      </div>
    </div>
  )
}
