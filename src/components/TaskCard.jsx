import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { User, Calendar, Trash2 } from 'lucide-react'

import useTaskStore from '../store/useTaskStore.js'
import { PRIORITY_COLORS } from '../types.js'
import { cn } from '../lib/cn.js'
import { ConfirmDialog } from './ConfirmDialog.jsx'
import { StatusMenu } from './StatusMenu.jsx'

const PRIORITY_STYLES = {
  Alta: {
    card: 'bg-rose-50/40',
    hover: 'hover:bg-rose-50/70 hover:ring-2 hover:ring-rose-200/70',
    dot: 'bg-rose-500',
  },
  Media: {
    card: 'bg-amber-50/40',
    hover: 'hover:bg-amber-50/70 hover:ring-2 hover:ring-amber-200/70',
    dot: 'bg-amber-400',
  },
  Baja: {
    card: 'bg-white',
    hover: 'hover:bg-sky-50/30 hover:ring-2 hover:ring-sky-200/60',
    dot: 'bg-sky-400',
  },
}

export function TaskCard({ task }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const styles = PRIORITY_STYLES[task.prioridad]

  const formattedDate = new Date(task.fechaActualizacion).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <>
      <div
        className={cn(
          'group rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 h-full',
          'shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
          styles.card,
          styles.hover
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug">{task.nombre}</h3>
          <button
            onClick={() => setConfirmOpen(true)}
            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-slate-300 hover:text-rose-500 hover:bg-rose-100/60 p-1.5 rounded-lg transition-all shrink-0 active:scale-90"
          >
            <Trash2 size={13} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md', PRIORITY_COLORS[task.prioridad])}>
            <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', styles.dot)} />
            {task.prioridad}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <User size={11} className="text-slate-400" />
            {task.owner}
          </span>
        </div>

        {task.descripcion && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{task.descripcion}</p>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100/80">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Estado
          </label>
          <StatusMenu value={task.estado} onChange={(s) => updateStatus(task.id, s)} />
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar size={11} />
          {formattedDate}
        </div>
      </div>

      <AnimatePresence>
        {confirmOpen && (
          <ConfirmDialog
            taskName={task.nombre}
            onConfirm={() => { deleteTask(task.id); setConfirmOpen(false) }}
            onCancel={() => setConfirmOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
