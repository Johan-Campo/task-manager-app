import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <TaskFilters />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 active:from-violet-800 active:to-purple-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-violet-200 transition-all duration-150 active:scale-[0.97]"
        >
          <Plus size={16} strokeWidth={2.5} />
          Nueva tarea
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Inbox size={28} className="text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">
                {tasks.length === 0 ? 'No hay tareas aún' : 'Sin resultados'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {tasks.length === 0
                  ? 'Crea la primera tarea con el botón de arriba'
                  : 'Ninguna tarea coincide con los filtros seleccionados'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((task, i) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.93 }}
                  transition={{ duration: 0.18, delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && <TaskForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  )
}
