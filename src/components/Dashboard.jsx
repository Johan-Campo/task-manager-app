import { LayoutGrid, AlertOctagon, Zap, CheckCircle2, AlertTriangle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'
import useTaskStore from '../store/useTaskStore.js'
import { PRIORITY, STATUS, STATUSES, PRIORITIES } from '../types.js'
import { cn } from '../lib/cn.js'
import { KanbanBoard } from './KanbanBoard.jsx'

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

const STATUS_CHART_COLORS = {
  Prospeccion: '#94a3b8',
  Propuesta: '#60a5fa',
  'En desarrollo': '#8b5cf6',
  QA: '#f97316',
  Entregado: '#34d399',
}

const PRIORITY_CHART_COLORS = {
  Alta: '#f43f5e',
  Media: '#f59e0b',
  Baja: '#0ea5e9',
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  return (
    <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-white/10">
      {label && <p className="font-semibold mb-0.5">{label}</p>}
      <p className="text-slate-300">{val} tarea{val !== 1 ? 's' : ''}</p>
    </div>
  )
}

export function Dashboard() {
  const tasks = useTaskStore((s) => s.tasks)

  const highPriority = tasks.filter(
    (t) => t.prioridad === PRIORITY.ALTA && t.estado !== STATUS.ENTREGADO
  )

  const statusChartData = STATUSES.map((s) => ({
    name: s,
    count: tasks.filter((t) => t.estado === s).length,
  }))

  const priorityChartData = PRIORITIES.map((p) => ({
    name: p,
    value: tasks.filter((t) => t.prioridad === p).length,
  })).filter((d) => d.value > 0)

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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-5">
            Distribución por estado
          </h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Sin datos aún</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusChartData} layout="vertical" margin={{ top: 0, right: 30, left: 105, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)', radius: 6 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={18} animationDuration={900} animationEasing="ease-out">
                  {statusChartData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_CHART_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-5">
            Distribución por prioridad
          </h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Sin datos aún</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={900}
                >
                  {priorityChartData.map((entry) => (
                    <Cell key={entry.name} fill={PRIORITY_CHART_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Tablero Kanban — arrastra para cambiar estado
        </h3>
        <KanbanBoard />
      </div>
    </div>
  )
}
