import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { STATUSES, STATUS_DOT_COLORS } from '../types.js'
import { cn } from '../lib/cn.js'

export function StatusMenu({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center justify-between gap-2 text-xs font-semibold rounded-xl px-3 py-1.5 cursor-pointer transition-all',
          'bg-violet-50 text-violet-700',
          open && 'ring-2 ring-violet-300'
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: STATUS_DOT_COLORS[value] }}
          />
          <span className="truncate">{value}</span>
        </span>
        <ChevronDown size={13} className={cn('shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-20 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-900/10 p-1.5 flex flex-col gap-0.5">
          {STATUSES.map((s) => {
            const active = s === value
            return (
              <button
                key={s}
                type="button"
                onClick={() => { onChange(s); setOpen(false) }}
                className={cn(
                  'flex items-center justify-between gap-2 text-xs font-medium rounded-lg px-2.5 py-1.5 text-left transition-colors',
                  active ? 'bg-violet-50 text-violet-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: STATUS_DOT_COLORS[s] }}
                  />
                  {s}
                </span>
                {active && <Check size={12} strokeWidth={3} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
