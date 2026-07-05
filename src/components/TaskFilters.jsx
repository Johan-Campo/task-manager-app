import { SlidersHorizontal, X } from 'lucide-react'

import useTaskStore, { useShallow } from '../store/useTaskStore.js'
import { PRIORITIES, STATUSES } from '../types.js'

export function TaskFilters() {
  const { filters, setFilter } = useTaskStore(
    useShallow((s) => ({ filters: s.filters, setFilter: s.setFilter }))
  )

  const hasFilter = filters.status || filters.priority

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <SlidersHorizontal size={12} />
        Filtrar
      </span>

      <select
        value={filters.status ?? ''}
        onChange={(e) => setFilter('status', e.target.value || null)}
        className="flex-1 sm:flex-none text-xs font-medium border border-slate-200 bg-white rounded-xl px-3 py-1.5 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 text-slate-600 cursor-pointer shadow-sm transition-all"
      >
        <option value="">Todos los estados</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={filters.priority ?? ''}
        onChange={(e) => setFilter('priority', e.target.value || null)}
        className="flex-1 sm:flex-none text-xs font-medium border border-slate-200 bg-white rounded-xl px-3 py-1.5 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 text-slate-600 cursor-pointer shadow-sm transition-all"
      >
        <option value="">Todas las prioridades</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {hasFilter && (
        <button
          onClick={() => { setFilter('status', null); setFilter('priority', null) }}
          className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-colors"
        >
          <X size={12} />
          Limpiar
        </button>
      )}
    </div>
  )
}
