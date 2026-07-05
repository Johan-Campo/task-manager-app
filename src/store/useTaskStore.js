import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

import { seedTasks } from '../data/seedTasks.js'

const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      filters: { status: null, priority: null },
      lastToast: null,

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
          lastToast: { type: 'added', taskName: task.nombre, ts: Date.now() },
        })),

      updateStatus: (id, newStatus) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id)
          if (!task) return state
          return {
            tasks: state.tasks.map((t) =>
              t.id === id
                ? { ...t, estado: newStatus, fechaActualizacion: new Date().toISOString() }
                : t
            ),
            lastToast: {
              type: 'status',
              taskName: task.nombre,
              previousStatus: task.estado,
              newStatus,
              ts: Date.now(),
            },
          }
        }),

      deleteTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id)
          return {
            tasks: state.tasks.filter((t) => t.id !== id),
            lastToast: { type: 'deleted', taskName: task?.nombre ?? '', ts: Date.now() },
          }
        }),

      setFilter: (type, value) =>
        set((state) => ({ filters: { ...state.filters, [type]: value } })),

      clearLastToast: () => set({ lastToast: null }),
    }),
    {
      name: 'task-manager-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.tasks.length === 0) {
          state.tasks = seedTasks
        }
      },
    }
  )
)

export { useShallow }
export default useTaskStore
