import { useState } from 'react'
import { money } from '../../utils/money'
import { SLOTS, STUDIO_WA } from './bookData'

const EMPTY = { name: '', phone: '', date: '', time: '', notes: '' }

export default function Checkout({ items, service, total, onDone }) {
  const [f, setF] = useState(EMPTY)
  const [err, setErr] = useState({})
  const [busy, setBusy] = useState(false)
  const [ref, setRef] = useState('')

  const install = service === 'install'
  const today = new Date().toISOString().slice(0, 10)
  const set = (k) => (e) => { setF((c) => ({ ...c, [k]: e.target.value })); if (err[k]) setErr((c) => ({ ...c, [k]: '' })) }

  const message = () => {
    const lines = items.map((x) => `- ${x.qty} x ${x.name} (${x.color}, ${x.length}", ${x.density}, ${x.lace}, ${x.cap} cap)`)
    return [
      `Hi! Order ${ref}`, ...lines,
      `Total: ${money(total)}`,
      install ? `Install: ${f.date} at ${f.time}` : 'Pickup or delivery',
      `Name: ${f.name}`, `Phone: ${f.phone}`, f.notes && `Notes: ${f.notes}`,
    ].filter(Boolean).join('\n')
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!items.length) next.cart = 'Add at least one wig to your cart first.'
    if (f.name.trim().length < 2) next.name = 'Enter your name.'
    if (f.phone.replace(/\D/g, '').length < 9) next.phone = 'Enter a valid phone number.'
    if (install && !f.date) next.date = 'Pick a date.'
    if (install && !f.time) next.time = 'Pick a time.'
    setErr(next)
    if (Object.keys(next).length) return

    setBusy(true)
    // TODO: await fetch('/api/orders', { method: 'POST', body: JSON.stringify({ items, service, ...f }) })
    // TODO: M-Pesa deposit (STK push) goes here
    await new Promise((r) => setTimeout(r, 700))
    setRef('NW-' + Math.random().toString(36).slice(2, 7).toUpperCase())
    setBusy(false)
  }

  if (ref) {
    return (
      <section className="bo-card bo-done" id="bo-checkout" role="status">
        <span className="bo-tick" aria-hidden="true">✓</span>
        <h2>Order received</h2>
        <p>Reference <b>{ref}</b>. Send it to us on WhatsApp so we can confirm{install ? ' your slot' : ' delivery'} and payment.</p>
        <div className="bo-doneactions">
          <a className="bo-btn" target="_blank" rel="noopener noreferrer"
            href={`https://wa.me/${STUDIO_WA}?text=${encodeURIComponent(message())}`}>Send on WhatsApp</a>
          <button className="bo-btn ghost" onClick={() => { setF(EMPTY); setRef(''); onDone() }}>Start a new order</button>
        </div>
      </section>
    )
  }

  return (
    <section className="bo-card" id="bo-checkout" aria-labelledby="bo-h-check">
      <header className="bo-cardhead">
        <span className="bo-step">03</span>
        <h2 id="bo-h-check">Your details</h2>
      </header>

      <form className="bo-form" onSubmit={submit} noValidate>
        <label className="bo-field">
          <span>Full name</span>
          <input value={f.name} onChange={set('name')} autoComplete="name" aria-invalid={!!err.name} />
          {err.name && <em role="alert">{err.name}</em>}
        </label>

        <label className="bo-field">
          <span>Phone / WhatsApp</span>
          <input type="tel" inputMode="tel" placeholder="0700 000 000" value={f.phone} onChange={set('phone')}
            autoComplete="tel" aria-invalid={!!err.phone} />
          {err.phone && <em role="alert">{err.phone}</em>}
        </label>

        {install && (
          <>
            <label className="bo-field">
              <span>Appointment date</span>
              <input type="date" min={today} value={f.date} onChange={set('date')} aria-invalid={!!err.date} />
              {err.date && <em role="alert">{err.date}</em>}
            </label>
            <fieldset className="bo-field bo-slots">
              <legend>Time</legend>
              <div className="bo-chips">
                {SLOTS.map((t) => (
                  <button type="button" key={t} className="bo-chip" aria-pressed={f.time === t}
                    onClick={() => { setF((c) => ({ ...c, time: t })); setErr((c) => ({ ...c, time: '' })) }}>{t}</button>
                ))}
              </div>
              {err.time && <em role="alert">{err.time}</em>}
            </fieldset>
          </>
        )}

        <label className="bo-field bo-wide">
          <span>{install ? 'Notes for your stylist (optional)' : 'Delivery area or pickup notes (optional)'}</span>
          <textarea rows="3" value={f.notes} onChange={set('notes')} />
        </label>

        {err.cart && <p className="bo-err bo-wide" role="alert">{err.cart}</p>}

        <button className="bo-btn bo-full bo-wide" type="submit" disabled={busy}>
          {busy ? 'Placing order...' : `Place order · ${money(total)}`}
        </button>
      </form>
    </section>
  )
}