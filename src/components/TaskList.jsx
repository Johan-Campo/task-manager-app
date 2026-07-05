import { useState } from 'react'
import { Plus, Inbox } from 'lucide-react'
import useTaskStore, { useShallow } from '../store/useTaskStore.js'
import { TaskCard } from './TaskCard.jsx'
import { TaskFilters } from './TaskFilters.jsx'
import { TaskForm } from './TaskForm.jsx'

export function TaskList() {
  const [showForm, setShowForm] = useState(false)
  const { tasks, filters } = useTaskStore(
    useShallow((s) => ({ tasks: s.tasks, filters: s.filters }))
  )

  const filtered = tasks.filter((t) => {
    if (filters.status && t.estado !== filters.status) return false
    if (filters.priority && t.prioridad !== filters.priority) return false
    return true
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <TaskFilters />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-all duration-150"
        >
          <Plus size={16} strokeWidth={2.5} />
          Nueva tarea
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
            <Inbox size={28} className="text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600">
              {tasks.length === 0 ? 'No hay tareas aún' : 'Sin resultados'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {tasks.length === 0 ? 'Crea la primera tarea con el botón de arriba' : 'Ninguna tarea coincide con los filtros seleccionados'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
