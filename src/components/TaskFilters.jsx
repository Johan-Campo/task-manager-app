import useTaskStore, { useShallow } from '../store/useTaskStore.js'
import { PRIORITIES, STATUSES } from '../types.js'

export function TaskFilters() {
  const { filters, setFilter } = useTaskStore(
    useShallow((s) => ({ filters: s.filters, setFilter: s.setFilter }))
  )

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-500">Estado:</label>
        <select
          value={filters.status ?? ''}
          onChange={(e) => setFilter('status', e.target.value || null)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
        >
          <option value="">Todos</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-500">Prioridad:</label>
        <select
          value={filters.priority ?? ''}
          onChange={(e) => setFilter('priority', e.target.value || null)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
        >
          <option value="">Todas</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {(filters.status || filters.priority) && (
        <button
          onClick={() => { setFilter('status', null); setFilter('priority', null) }}
          className="text-xs text-indigo-600 hover:text-indigo-800 underline transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
