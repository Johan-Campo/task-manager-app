import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { seedTasks } from '../data/seedTasks.js'

const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      filters: { status: null, priority: null },
      lastStatusChange: null,

      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

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
            lastStatusChange: {
              taskName: task.nombre,
              previousStatus: task.estado,
              newStatus,
            },
          }
        }),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      setFilter: (type, value) =>
        set((state) => ({ filters: { ...state.filters, [type]: value } })),

      clearLastStatusChange: () => set({ lastStatusChange: null }),
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
