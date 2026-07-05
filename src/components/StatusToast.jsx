import { useEffect } from 'react'
import useTaskStore, { useShallow } from '../store/useTaskStore.js'

export function StatusToast() {
  const { lastStatusChange, clearLastStatusChange } = useTaskStore(
    useShallow((s) => ({
      lastStatusChange: s.lastStatusChange,
      clearLastStatusChange: s.clearLastStatusChange,
    }))
  )

  useEffect(() => {
    if (!lastStatusChange) return
    const timer = setTimeout(clearLastStatusChange, 4000)
    return () => clearTimeout(timer)
  }, [lastStatusChange, clearLastStatusChange])

  if (!lastStatusChange) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white text-sm rounded-xl px-5 py-3 shadow-xl flex items-start gap-3 max-w-sm animate-in">
      <span className="text-green-400 text-base shrink-0">✓</span>
      <div>
        <p className="font-medium leading-snug">{lastStatusChange.taskName}</p>
        <p className="text-slate-300 text-xs mt-0.5">
          {lastStatusChange.previousStatus} → <strong className="text-white">{lastStatusChange.newStatus}</strong>
        </p>
      </div>
      <button
        onClick={clearLastStatusChange}
        className="ml-auto text-slate-400 hover:text-white transition-colors shrink-0"
      >
        ×
      </button>
    </div>
  )
}
