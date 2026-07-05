import { AlertTriangle } from 'lucide-react'

export function ConfirmDialog({ taskName, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel()
        if (e.key === 'Enter') onConfirm()
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-rose-500 to-red-600" />
        <div className="px-6 pt-7 pb-5 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-50 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <AlertTriangle size={24} className="text-rose-600" />
          </div>
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
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 rounded-xl shadow-sm shadow-rose-200 transition-all"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
