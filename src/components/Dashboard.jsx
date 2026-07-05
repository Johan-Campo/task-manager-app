import useTaskStore from '../store/useTaskStore.js'
import { PRIORITY, STATUS, STATUSES, STATUS_COLORS, PRIORITY_COLORS, STATUS_BAR_COLORS } from '../types.js'
import { cn } from '../lib/cn.js'

export function Dashboard() {
  const tasks = useTaskStore((s) => s.tasks)

  const total = tasks.length
  const byStatus = STATUSES.map((s) => ({ label: s, count: tasks.filter((t) => t.estado === s).length }))
  const highPriority = tasks.filter((t) => t.prioridad === PRIORITY.ALTA && t.estado !== STATUS.ENTREGADO)

  const countByPriority = (p) => tasks.filter((t) => t.prioridad === p).length

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total tareas" value={total} color="bg-indigo-50 text-indigo-700" />
        <StatCard label="Prioridad Alta" value={countByPriority(PRIORITY.ALTA)} color="bg-red-50 text-red-700" />
        <StatCard label="Prioridad Media" value={countByPriority(PRIORITY.MEDIA)} color="bg-orange-50 text-orange-700" />
        <StatCard label="Prioridad Baja" value={countByPriority(PRIORITY.BAJA)} color="bg-slate-50 text-slate-600" />
      </div>

      {highPriority.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-700 mb-2">
            ⚠ {highPriority.length} tarea{highPriority.length > 1 ? 's' : ''} de prioridad Alta pendiente{highPriority.length > 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {highPriority.map((t) => (
              <span key={t.id} className="text-xs bg-white border border-red-200 text-red-700 px-2 py-1 rounded-lg">
                {t.nombre}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Distribución por estado</h3>
        {total === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Sin datos</p>
        ) : (
          <div className="space-y-3">
            {byStatus.map(({ label, count }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full w-28 text-center shrink-0', STATUS_COLORS[label])}>
                    {label}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className={cn('h-2 rounded-full transition-all', STATUS_BAR_COLORS[label])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-10 text-right shrink-0">{count} ({pct}%)</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Tablero Kanban</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUSES.map((status) => {
            const column = tasks.filter((t) => t.estado === status)
            return (
              <div key={status} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', STATUS_COLORS[status])}>
                    {status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{column.length}</span>
                </div>
                <div className="space-y-2">
                  {column.length === 0 && (
                    <p className="text-xs text-slate-300 text-center py-3">—</p>
                  )}
                  {column.map((t) => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-lg p-2 text-xs">
                      <p className="font-medium text-slate-700 leading-snug">{t.nombre}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-medium', PRIORITY_COLORS[t.prioridad])}>
                          {t.prioridad}
                        </span>
                        <span className="text-slate-400">{t.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className={cn('rounded-xl p-4 border border-slate-200', color)}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-1 opacity-80">{label}</p>
    </div>
  )
}
