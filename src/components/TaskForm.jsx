import { useState } from 'react'
import { X, User, Tag, Flag, AlignLeft, CheckCircle } from 'lucide-react'
import useTaskStore from '../store/useTaskStore.js'
import { PRIORITIES, STATUSES } from '../types.js'
import { cn } from '../lib/cn.js'

const EMPTY_FORM = {
  nombre: '',
  owner: '',
  prioridad: 'Alta',
  estado: 'Prospeccion',
  descripcion: '',
}

export function TaskForm({ onClose }) {
  const addTask = useTaskStore((s) => s.addTask)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.nombre.trim()) next.nombre = 'El nombre es requerido'
    if (!form.owner.trim()) next.owner = 'El responsable es requerido'
    return next
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) { setErrors(next); return }
    addTask({
      id: crypto.randomUUID(),
      ...form,
      nombre: form.nombre.trim(),
      owner: form.owner.trim(),
      descripcion: form.descripcion.trim(),
      fechaActualizacion: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-display font-bold text-slate-900 text-base">Nueva tarea</h2>
            <p className="text-xs text-slate-400 mt-0.5">Completa los campos para crear una tarea</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Field label="Nombre de la tarea" icon={<Tag size={12} />} error={errors.nombre}>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Enviar propuesta comercial"
              className={cn(
                'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all bg-slate-50 focus:bg-white',
                errors.nombre
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-50'
                  : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
              )}
            />
          </Field>

          <Field label="Responsable" icon={<User size={12} />} error={errors.owner}>
            <input
              name="owner"
              value={form.owner}
              onChange={handleChange}
              placeholder="Ej: Johan Campo"
              className={cn(
                'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all bg-slate-50 focus:bg-white',
                errors.owner
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-50'
                  : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
              )}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prioridad" icon={<Flag size={12} />}>
              <select
                name="prioridad"
                value={form.prioridad}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-slate-50 focus:bg-white transition-all cursor-pointer"
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>

            <Field label="Estado inicial">
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-slate-50 focus:bg-white transition-all cursor-pointer"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Descripción" icon={<AlignLeft size={12} />}>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Detalle de la tarea..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-slate-50 focus:bg-white transition-all resize-none"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-all"
            >
              <CheckCircle size={14} />
              Crear tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
