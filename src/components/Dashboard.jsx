import { LayoutGrid, AlertOctagon, Zap, CheckCircle2, AlertTriangle, ArrowUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

import { useTaskStore } from '../store/useTaskStore.js'
import { PRIORITY, STATUS, STATUSES, PRIORITIES, STATUS_DOT_COLORS, PRIORITY_CHART_COLORS } from '../types.js'
import { cn } from '../lib/cn.js'
import { KanbanBoard } from './KanbanBoard.jsx'

const CHART_TOKENS = {
  text: 'var(--color-slate-500)',
  cursorFill: 'rgba(139,92,246,0.05)',
}

const CARD_THEME = {
  violet:  { bg: 'bg-white',       border: 'border-slate-100',   iconBg: 'bg-violet-100', iconText: 'text-violet-600', color: 'var(--color-violet-500)' },
  rose:    { bg: 'bg-rose-50',     border: 'border-rose-100',    iconBg: 'bg-rose-100',   iconText: 'text-rose-500',   color: 'var(--color-rose-500)'   },
  amber:   { bg: 'bg-amber-50',    border: 'border-amber-100',   iconBg: 'bg-amber-100',  iconText: 'text-amber-500',  color: 'var(--color-amber-500)'  },
  emerald: { bg: 'bg-emerald-50',  border: 'border-emerald-100', iconBg: 'bg-emerald-100',iconText: 'text-emerald-600',color: 'var(--color-emerald-500)'},
}

function ProgressRing({ pct, colorVar, size = 52 }) {
  const sw = 3.5
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colorVar} strokeWidth={sw} opacity={0.15} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colorVar} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="text-[11px] font-bold tabular-nums" style={{ color: colorVar }}>{pct}%</span>
    </div>
  )
}

function TrendChip({ delta }) {
  if (!delta) return null
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
      <ArrowUp size={10} strokeWidth={2.5} />
      +{delta} esta semana
    </span>
  )
}

function StatCard({ themeName, icon: Icon, label, value, ring, breakdown, trend }) {
  const t = CARD_THEME[themeName]
  return (
    <div className={cn('rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200', t.bg, t.border)}>
      <div className="flex items-start gap-1.5 mb-3">
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', t.iconBg)}>
          <Icon size={13} className={t.iconText} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pt-0.5 leading-tight">{label}</p>
      </div>

      {ring ? (
        <div className="flex items-center gap-3">
          <ProgressRing pct={ring} colorVar={t.color} />
          <div>
            <p className="text-3xl font-bold text-slate-900 tabular-nums leading-none">{value}</p>
            {trend !== undefined && <TrendChip delta={trend} />}
          </div>
        </div>
      ) : breakdown ? (
        <div className="flex items-end justify-between gap-2">
          <p className="text-3xl font-bold text-slate-900 tabular-nums leading-none">{value}</p>
          <div className="space-y-1 pb-0.5">
            {breakdown.map((b) => (
              <div key={b.label} className="flex items-center justify-between gap-5">
                <span className="text-[11px] text-slate-400">{b.label}</span>
                <span className="text-[11px] font-bold text-slate-700">{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-3xl font-bold text-slate-900 tabular-nums leading-none mb-2">{value}</p>
          {trend !== undefined && <TrendChip delta={trend} />}
        </div>
      )}
    </div>
  )
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
  const total = tasks.length

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentTotal = tasks.filter((t) => new Date(t.fechaActualizacion) >= weekAgo).length
  const recentDelivered = tasks.filter((t) => t.estado === STATUS.ENTREGADO && new Date(t.fechaActualizacion) >= weekAgo).length

  const altaCount = tasks.filter((t) => t.prioridad === PRIORITY.ALTA).length
  const altaPct = total > 0 ? Math.round((altaCount / total) * 100) : 0

  const enDesarrolloCount = tasks.filter((t) => t.estado === STATUS.EN_DESARROLLO).length
  const qaCount = tasks.filter((t) => t.estado === STATUS.QA).length
  const progresoCount = enDesarrolloCount + qaCount

  const entregadasCount = tasks.filter((t) => t.estado === STATUS.ENTREGADO).length
  const entregadasPct = total > 0 ? Math.round((entregadasCount / total) * 100) : 0

  const highPriority = tasks.filter(
    (t) => t.prioridad === PRIORITY.ALTA && t.estado !== STATUS.ENTREGADO
  )

  const statusChartData = STATUSES.map((s) => ({
    name: s,
    count: tasks.filter((t) => t.estado === s).length,
    fill: STATUS_DOT_COLORS[s],
  }))

  const priorityChartData = PRIORITIES.map((p) => ({
    name: p,
    value: tasks.filter((t) => t.prioridad === p).length,
    fill: PRIORITY_CHART_COLORS[p],
  })).filter((d) => d.value > 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          themeName="violet"
          icon={LayoutGrid}
          label="Total Tareas"
          value={total}
          trend={recentTotal}
        />
        <StatCard
          themeName="rose"
          icon={AlertOctagon}
          label="Prioridad Alta"
          value={altaCount}
          ring={altaPct}
        />
        <StatCard
          themeName="amber"
          icon={Zap}
          label="En Progreso"
          value={progresoCount}
          breakdown={[
            { label: 'Desarrollo', count: enDesarrolloCount },
            { label: 'QA', count: qaCount },
          ]}
        />
        <StatCard
          themeName="emerald"
          icon={CheckCircle2}
          label="Entregadas"
          value={entregadasCount}
          ring={entregadasPct}
          trend={recentDelivered}
        />
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
                  tick={{ fontSize: 11, fontWeight: 600, fill: CHART_TOKENS.text }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: CHART_TOKENS.cursorFill, radius: 6 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={18} animationDuration={900} animationEasing="ease-out">
                  {statusChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
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
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 11, fontWeight: 600, color: CHART_TOKENS.text }}>{value}</span>
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
