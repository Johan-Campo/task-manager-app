import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X, ArrowRight } from 'lucide-react'

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
    const timer = setTimeout(clearLastStatusChange, 4500)
    return () => clearTimeout(timer)
  }, [lastStatusChange, clearLastStatusChange])

  return (
    <AnimatePresence>
      {lastStatusChange && (
        <motion.div
          key={lastStatusChange.taskName + lastStatusChange.newStatus}
          initial={{ opacity: 0, x: 80, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.92 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 bg-slate-900 text-white rounded-2xl px-4 py-3.5 shadow-2xl border border-white/10 max-w-[calc(100vw-1.5rem)] sm:max-w-sm"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight truncate">{lastStatusChange.taskName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-400">{lastStatusChange.previousStatus}</span>
              <ArrowRight size={10} className="text-slate-500 shrink-0" />
              <span className="text-xs font-semibold text-emerald-400">{lastStatusChange.newStatus}</span>
            </div>
          </div>

          <button
            onClick={clearLastStatusChange}
            className="text-slate-500 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors shrink-0 active:scale-95"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
