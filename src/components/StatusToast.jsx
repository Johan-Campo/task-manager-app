import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X, ArrowRight, PlusCircle, Trash2 } from 'lucide-react'

import { useShallow } from 'zustand/react/shallow'

import { useTaskStore } from '../store/useTaskStore.js'

const VARIANTS = {
  added: {
    icon: PlusCircle,
    iconBg: 'bg-gradient-to-br from-violet-500/30 to-violet-600/20',
    iconColor: 'text-violet-400',
    label: 'Tarea creada',
  },
  deleted: {
    icon: Trash2,
    iconBg: 'bg-gradient-to-br from-rose-500/30 to-rose-600/20',
    iconColor: 'text-rose-400',
    label: 'Tarea eliminada',
  },
  status: {
    icon: CheckCircle2,
    iconBg: 'bg-gradient-to-br from-emerald-500/30 to-emerald-600/20',
    iconColor: 'text-emerald-400',
    label: null,
  },
}

export function StatusToast() {
  const { lastToast, clearLastToast } = useTaskStore(
    useShallow((s) => ({ lastToast: s.lastToast, clearLastToast: s.clearLastToast }))
  )

  useEffect(() => {
    if (!lastToast) return
    const timer = setTimeout(clearLastToast, 4500)
    return () => clearTimeout(timer)
  }, [lastToast, clearLastToast])

  const v = lastToast ? VARIANTS[lastToast.type] : null
  const Icon = v?.icon

  return (
    <AnimatePresence>
      {lastToast && v && (
        <motion.div
          key={lastToast.ts}
          initial={{ opacity: 0, x: 80, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.92 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 bg-slate-900 text-white rounded-2xl px-4 py-3.5 shadow-2xl border border-white/10 max-w-[calc(100vw-1.5rem)] sm:max-w-sm"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${v.iconBg}`}>
            <Icon size={16} className={v.iconColor} />
          </div>

          <div className="min-w-0 flex-1">
            {lastToast.type === 'status' ? (
              <>
                <p className="text-sm font-semibold leading-tight truncate">{lastToast.taskName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-slate-400">{lastToast.previousStatus}</span>
                  <ArrowRight size={10} className="text-slate-500 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-400">{lastToast.newStatus}</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold leading-tight">{v.label}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{lastToast.taskName}</p>
              </>
            )}
          </div>

          <button
            onClick={clearLastToast}
            className="text-slate-500 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors shrink-0 active:scale-95"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
