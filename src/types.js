export const PRIORITY = {
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
}

export const STATUS = {
  PROSPECCION: 'Prospeccion',
  PROPUESTA: 'Propuesta',
  EN_DESARROLLO: 'En desarrollo',
  QA: 'QA',
  ENTREGADO: 'Entregado',
}

export const PRIORITIES = Object.values(PRIORITY)
export const STATUSES = Object.values(STATUS)

export const STATUS_FLOW = [
  STATUS.PROSPECCION,
  STATUS.PROPUESTA,
  STATUS.EN_DESARROLLO,
  STATUS.QA,
  STATUS.ENTREGADO,
]

export const STATUS_COLORS = {
  [STATUS.PROSPECCION]: 'bg-slate-100 text-slate-600',
  [STATUS.PROPUESTA]: 'bg-blue-100 text-blue-700',
  [STATUS.EN_DESARROLLO]: 'bg-violet-100 text-violet-700',
  [STATUS.QA]: 'bg-orange-100 text-orange-700',
  [STATUS.ENTREGADO]: 'bg-emerald-100 text-emerald-700',
}

export const PRIORITY_COLORS = {
  [PRIORITY.ALTA]: 'bg-rose-100 text-rose-700',
  [PRIORITY.MEDIA]: 'bg-amber-100 text-amber-700',
  [PRIORITY.BAJA]: 'bg-sky-100 text-sky-600',
}

export const PRIORITY_BORDER = {
  [PRIORITY.ALTA]: 'border-l-rose-500',
  [PRIORITY.MEDIA]: 'border-l-amber-400',
  [PRIORITY.BAJA]: 'border-l-sky-400',
}

export const KANBAN_BORDER_COLORS = {
  [STATUS.PROSPECCION]: 'border-t-slate-400',
  [STATUS.PROPUESTA]: 'border-t-blue-500',
  [STATUS.EN_DESARROLLO]: 'border-t-violet-600',
  [STATUS.QA]: 'border-t-orange-500',
  [STATUS.ENTREGADO]: 'border-t-emerald-500',
}

export const STATUS_BAR_COLORS = {
  [STATUS.PROSPECCION]: 'bg-gradient-to-r from-slate-400 to-slate-500',
  [STATUS.PROPUESTA]: 'bg-gradient-to-r from-blue-400 to-blue-600',
  [STATUS.EN_DESARROLLO]: 'bg-gradient-to-r from-violet-500 to-purple-600',
  [STATUS.QA]: 'bg-gradient-to-r from-orange-400 to-orange-500',
  [STATUS.ENTREGADO]: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
}

export const STATUS_DOT_COLORS = {
  [STATUS.PROSPECCION]: '#94a3b8',
  [STATUS.PROPUESTA]: '#60a5fa',
  [STATUS.EN_DESARROLLO]: '#8b5cf6',
  [STATUS.QA]: '#f97316',
  [STATUS.ENTREGADO]: '#34d399',
}
