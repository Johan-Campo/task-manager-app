import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

const spring = { duration: 0.22, ease: [0.16, 1, 0.3, 1] }

export function ConfirmDialog({ taskName, onConfirm, onCancel }) {
  const onCancelRef = useRef(onCancel)
  useEffect(() => { onCancelRef.current = onCancel })
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onCancelRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={spring}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden"
      >
        <div className="h-1 bg-gradient-to-r from-rose-500 to-red-600" />
        <div className="px-6 pt-7 pb-5 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-14 h-14 bg-gradient-to-br from-rose-50 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
          >
            <AlertTriangle size={24} className="text-rose-600" />
          </motion.div>
          <h2 className="font-display font-bold text-slate-900 text-lg">¿Eliminar tarea?</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Estás a punto de eliminar{' '}
            <span className="font-semibold text-slate-800">"{taskName}"</span>.
            <br />
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-[0.97]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 rounded-xl shadow-sm shadow-rose-200 transition-all active:scale-[0.97]"
          >
            Sí, eliminar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
