import { useMemo, useState } from 'react'
import { BOOKING_DAYS, dayHasSlots, fromISO, iso } from '../../data/availability'

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function Calendar({ value, onChange, stylistId }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const last = useMemo(() => { const d = new Date(today); d.setDate(d.getDate() + BOOKING_DAYS); return d }, [today])
  const start = value ? fromISO(value) : today
  const [view, setView] = useState(new Date(start.getFullYear(), start.getMonth(), 1))

  const y = view.getFullYear(), m = view.getMonth()
  const cells = [
    ...Array(new Date(y, m, 1).getDay()).fill(null),
    ...Array.from({ length: new Date(y, m + 1, 0).getDate() }, (_, i) => new Date(y, m, i + 1)),
  ]
  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1)
  const canNext = new Date(y, m + 1, 1) <= last
  const shift = (n) => setView(new Date(y, m + n, 1))

  return (
    <div className="cal">
      <div className="cal-head">
        <button onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month">
          <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <b aria-live="polite">{view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</b>
        <button onClick={() => shift(1)} disabled={!canNext} aria-label="Next month">
          <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="cal-grid" role="grid">
        {DOW.map((d) => <span key={d} className="cal-dow">{d}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={'b' + i} />
          const key = iso(d)
          const ok = d >= today && d <= last && dayHasSlots(stylistId, key)
          return (
            <button key={key} className={'cal-day' + (key === value ? ' sel' : '') + (d.getTime() === today.getTime() ? ' today' : '')}
              disabled={!ok} aria-pressed={key === value}
              aria-label={d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + (ok ? '' : ', unavailable')}
              onClick={() => onChange(key)}>
              {d.getDate()}
              {ok && <i />}
            </button>
          )
        })}
      </div>
    </div>
  )
}