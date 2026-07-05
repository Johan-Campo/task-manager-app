import { LayoutGrid, AlertOctagon, Zap, CheckCircle2, AlertTriangle } from 'lucide-react'
import useTaskStore from '../store/useTaskStore.js'
import { PRIORITY, STATUS, STATUSES, STATUS_COLORS, PRIORITY_COLORS, STATUS_BAR_COLORS, KANBAN_BORDER_COLORS } from '../types.js'
import { cn } from '../lib/cn.js'

const STAT_CARDS = [
  {
    label: 'Total tareas',
    icon: LayoutGrid,
    gradient: 'from-violet-500 to-purple-600',
    getValue: (t) => t.length,
  },
  {
    label: 'Prioridad Alta',
    icon: AlertOctagon,
    gradient: 'from-rose-500 to-red-600',
    getValue: (t) => t.filter((x) => x.prioridad === PRIORITY.ALTA).length,
  },
  {
    label: 'En progreso',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-500',
    getValue: (t) => t.filter((x) => [STATUS.EN_DESARROLLO, STATUS.QA].includes(x.estado)).length,
  },
  {
    label: 'Entregadas',
    icon: CheckCircle2,
    gradient: 'from-emerald-400 to-teal-500',
    getValue: (t) => t.filter((x) => x.estado === STATUS.ENTREGADO).length,
  },
]

export function Dashboard() {
  const tasks = useTaskStore((s) => s.tasks)

  const byStatus = STATUSES.map((s) => ({
    label: s,
    count: tasks.filter((t) => t.estado === s).length,
  }))

  const highPriority = tasks.filter(
    (t) => t.prioridad === PRIORITY.ALTA && t.estado !== STATUS.ENTREGADO
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, icon: Icon, gradient, getValue }) => (
          <div
            key={label}
            className={cn(
              'bg-gradient-to-br rounded-2xl p-5 text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
              gradient
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-display font-bold text-white mt-1 tabular-nums">{getValue(tasks)}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={18} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {highPriority.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-rose-200">
            <AlertTriangle size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-rose-800">
              {highPriority.length} tarea{highPriority.length > 1 ? 's' : ''} de prioridad Alta pendiente{highPriority.length > 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {highPriority.map((t) => (
                <span key={t.id} className="text-xs bg-white border border-rose-200 text-rose-700 px-2.5 py-1 rounded-lg font-medium shadow-sm">
                  {t.nombre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-5">
          Distribución por estado
        </h3>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Sin datos aún</p>
        ) : (
          <div className="space-y-3.5">
            {byStatus.map(({ label, count }) => {
              const pct = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-lg w-32 text-center shrink-0', STATUS_COLORS[label])}>
                    {label}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={cn('h-2.5 rounded-full transition-all duration-700', STATUS_BAR_COLORS[label])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 w-20 text-right shrink-0 tabular-nums">
                    {count} <span className="font-normal text-slate-400">({pct}%)</span>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Tablero Kanban</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STATUSES.map((status) => {
            const column = tasks.filter((t) => t.estado === status)
            return (
              <div
                key={status}
                className={cn(
                  'bg-white border border-slate-200/80 border-t-2 rounded-2xl p-3 shadow-sm',
                  KANBAN_BORDER_COLORS[status]
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700">{status}</span>
                  <span className="min-w-5 h-5 px-1.5 bg-slate-100 rounded-full text-[11px] font-bold text-slate-500 flex items-center justify-center">
                    {column.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {column.length === 0 ? (
                    <div className="py-5 text-center text-xs text-slate-300 border-2 border-dashed border-slate-100 rounded-xl">
                      Vacío
                    </div>
                  ) : (
                    column.map((t) => (
                      <div key={t.id} className="bg-slate-50 hover:bg-violet-50/50 border border-slate-100 rounded-xl p-2.5 transition-colors">
                        <p className="text-xs font-semibold text-slate-700 leading-snug mb-1.5">{t.nombre}</p>
                        <div className="flex items-center gap-1.5">
                          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md', PRIORITY_COLORS[t.prioridad])}>
                            {t.prioridad}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">{t.owner}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
