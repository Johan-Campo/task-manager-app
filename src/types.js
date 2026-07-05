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
  [STATUS.PROSPECCION]: 'bg-slate-100 text-slate-700',
  [STATUS.PROPUESTA]: 'bg-blue-100 text-blue-700',
  [STATUS.EN_DESARROLLO]: 'bg-indigo-100 text-indigo-700',
  [STATUS.QA]: 'bg-amber-100 text-amber-700',
  [STATUS.ENTREGADO]: 'bg-green-100 text-green-700',
}

export const PRIORITY_COLORS = {
  [PRIORITY.ALTA]: 'bg-red-100 text-red-700',
  [PRIORITY.MEDIA]: 'bg-orange-100 text-orange-700',
  [PRIORITY.BAJA]: 'bg-slate-100 text-slate-600',
}

export const STATUS_BAR_COLORS = {
  [STATUS.PROSPECCION]: 'bg-slate-400',
  [STATUS.PROPUESTA]: 'bg-blue-500',
  [STATUS.EN_DESARROLLO]: 'bg-indigo-500',
  [STATUS.QA]: 'bg-amber-500',
  [STATUS.ENTREGADO]: 'bg-green-500',
}
