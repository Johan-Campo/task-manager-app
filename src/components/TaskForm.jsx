import { useState } from 'react'
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
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Nueva tarea</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Field label="Nombre" error={errors.nombre}>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Enviar propuesta comercial"
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
                'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100',
                errors.nombre && 'border-red-400'
              )}
            />
          </Field>

          <Field label="Responsable" error={errors.owner}>
            <input
              name="owner"
              value={form.owner}
              onChange={handleChange}
              placeholder="Ej: Johan Perez"
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
                'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100',
                errors.owner && 'border-red-400'
              )}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Prioridad">
              <select
                name="prioridad"
                value={form.prioridad}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>

            <Field label="Estado inicial">
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Detalle de la tarea..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Crear tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
