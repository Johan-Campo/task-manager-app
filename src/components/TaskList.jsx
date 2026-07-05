import { useState } from 'react'
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
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Nueva tarea
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">
            {tasks.length === 0 ? 'No hay tareas aún. ¡Crea la primera!' : 'Ninguna tarea coincide con los filtros.'}
          </p>
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
