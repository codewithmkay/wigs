import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { services } from '../../data/services'
import { employees } from '../../data/employees'
import { products } from '../../data/products'
import { assign, dayHasSlots, fromISO, getSlots } from '../../data/availability'
import Calendar from './Calendar'
import { money } from '../../utils/money'

const STEPS = ['Service', 'Stylist', 'Time', 'Details']
const ANY = { id: 'any', name: 'First available', role: 'We match you with the next free specialist', mark: '1st', tone: ['#0d0d12', '#6d4aff'], specialties: [] }
const p2 = (n) => String(n).padStart(2, '0')
const t12 = (t) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${p2(m)} ${h < 12 ? 'AM' : 'PM'}` }
const dLong = (s) => fromISO(s).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

function Avatar({ e, size = 56 }) {
  const mark = e.mark || e.name.split(' ').map((w) => w[0]).join('').slice(0, 2)
  if (e.photo) return <img className="av" src={e.photo} alt="" width={size} height={size} />
  return <span className="av" style={{ width: size, height: size, background: `linear-gradient(140deg,${e.tone[0]},${e.tone[1]})` }}>{mark}</span>
}

export default function Booking() {
  const root = useRef(null)
  const [params] = useSearchParams()
  const pS = services.some((s) => s.id === params.get('service')) ? params.get('service') : ''
  const pE = employees.some((e) => e.id === params.get('stylist')) ? params.get('stylist') : ''
  const pW = products.some((p) => p.id === params.get('wig')) ? params.get('wig') : 'own'

  const [step, setStep] = useState(pS ? (pE ? 2 : 1) : 0)
  const [serviceId, setServiceId] = useState(pS)
  const [stylistId, setStylistId] = useState(pE)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [d, setD] = useState({ name: '', email: '', phone: '', wig: pW, notes: '' })
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState('idle') // idle | busy | done
  const [ref, setRef] = useState('')
  const [assigned, setAssigned] = useState('')
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)

  const service = services.find((s) => s.id === serviceId)
  const stylist = stylistId === 'any' ? ANY : employees.find((e) => e.id === stylistId)
  const finalStylist = employees.find((e) => e.id === assigned) || stylist
  const wig = products.find((p) => p.id === d.wig)

  // load slots (swap for your API call)
  useEffect(() => {
    if (!date || !stylistId) { setSlots([]); return }
    setLoading(true)
    const t = setTimeout(() => { setSlots(getSlots(stylistId, date)); setLoading(false) }, 350)
    return () => clearTimeout(t)
  }, [date, stylistId])

  const errors = {
    name: d.name.trim().length < 2 ? 'Enter your full name.' : '',
    email: /^\S+@\S+\.\S+$/.test(d.email) ? '' : 'Enter a valid email, like name@example.com.',
    phone: d.phone.replace(/\D/g, '').length >= 7 ? '' : 'Enter a phone number we can reach you on.',
  }
  const valid = !errors.name && !errors.email && !errors.phone
  const canNext = [!!serviceId, !!stylistId, !!(date && time), true][step]

  const pickStylist = (id) => {
    setStylistId(id); setTime('')
    if (date && !dayHasSlots(id, date)) setDate('')
  }
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value })

  const submit = async () => {
    setStatus('busy')
    const payload = {
      serviceId, stylistId: assign(stylistId, date, time), date, time,
      customer: { name: d.name, email: d.email, phone: d.phone },
      wigId: d.wig === 'own' ? null : d.wig, notes: d.notes,
    }
    // TODO: const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    await new Promise((r) => setTimeout(r, 900))
    setAssigned(payload.stylistId)
    setRef('VLR-' + Math.random().toString(36).slice(2, 8).toUpperCase())
    setStatus('done')
  }

  const next = () => {
    if (step < 3) return setStep(step + 1)
    setTouched(true)
    if (valid) submit()
  }

  const reset = () => {
    setStep(0); setServiceId(''); setStylistId(''); setDate(''); setTime(''); setAssigned('')
    setD({ name: '', email: '', phone: '', wig: 'own', notes: '' }); setTouched(false); setStatus('idle')
  }

  const addToCalendar = () => {
    const [h, m] = time.split(':').map(Number)
    const s = fromISO(date); s.setHours(h, m, 0, 0)
    const e = new Date(s.getTime() + service.minutes * 60000)
    const f = (x) => `${x.getFullYear()}${p2(x.getMonth() + 1)}${p2(x.getDate())}T${p2(x.getHours())}${p2(x.getMinutes())}00`
    const text = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Velora//EN', 'BEGIN:VEVENT', `UID:${ref}@velora`, `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(s)}`, `DTEND:${f(e)}`, `SUMMARY:Velora: ${service.name}`, `DESCRIPTION:Stylist ${finalStylist.name}. Reference ${ref}.`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/calendar' }))
    a.download = 'velora-booking.ics'
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 500)
  }

  // scroll to the top of the flow when the step changes
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    root.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step, status])

  // animate each panel in
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.bk-anim', { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out', clearProps: 'transform,opacity' })
      gsap.fromTo('.bk-check path', { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 0.9, delay: 0.3, ease: 'power2.out' })
    }, root)
    return () => mm.revert()
  }, [step, status])

  return (
    <section className="bk" id="booking" ref={root}>
      {status === 'done' ? (
        <div className="bk-done">
          <svg className="bk-check bk-anim" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="29" /><path pathLength="60" d="M19 33l9 9 17-19" />
          </svg>
          <h2 className="bk-anim">You are booked.</h2>
          <p className="bk-anim muted">A confirmation is on its way to {d.email}.</p>
          <div className="bk-ref bk-anim"><span>Reference</span><b>{ref}</b></div>
          <dl className="bk-sum-list bk-anim">
            <div><dt>Service</dt><dd>{service.name}</dd></div>
            <div><dt>Stylist</dt><dd>{finalStylist.name}</dd></div>
            <div><dt>When</dt><dd>{dLong(date)} at {t12(time)}</dd></div>
            <div><dt>Duration</dt><dd>About {service.minutes} min</dd></div>
          </dl>
          <div className="bk-actions bk-anim">
            <button className="btn" onClick={addToCalendar}>Add to calendar</button>
            <button className="btn ghost" onClick={reset}>Book another</button>
            <Link className="btn ghost" to="/shop">Browse wigs</Link>
          </div>
        </div>
      ) : (
        <>
          <ol className="bk-rail" aria-label="Booking steps">
            {STEPS.map((s, i) => (
              <li key={s} className={i === step ? 'now' : i < step ? 'done' : ''}>
                <button disabled={i >= step || status === 'busy'} onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined}>
                  <b>{p2(i + 1)}</b><span>{s}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="bk-layout">
            <div className="bk-panel">
              {step === 0 && (
                <>
                  <h2 className="bk-anim">Choose your service</h2>
                  <div className="bk-cards bk-anim" role="radiogroup" aria-label="Service">
                    {services.map((s) => (
                      <button key={s.id} role="radio" aria-checked={serviceId === s.id} className="opt-card" onClick={() => setServiceId(s.id)}>
                        <span className="oc-top">
                          <b>{s.name}</b>
                          {s.tag && <em>{s.tag}</em>}
                        </span>
                        <span className="oc-desc">{s.desc}</span>
                        <ul>{s.includes.map((x) => <li key={x}>{x}</li>)}</ul>
                        <span className="oc-foot"><b>${s.price}</b><span>{s.minutes} min</span></span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="bk-anim">Pick your stylist</h2>
                  <div className="bk-team bk-anim" role="radiogroup" aria-label="Stylist">
                    {[ANY, ...employees].map((e) => (
                      <button key={e.id} role="radio" aria-checked={stylistId === e.id} className="emp" onClick={() => pickStylist(e.id)}>
                        <Avatar e={e} />
                        <span className="emp-info">
                          <b>{e.name}</b>
                          <em>{e.role}</em>
                          {e.rating && <span className="emp-stat">&#9733; {e.rating.toFixed(1)} &middot; {e.installs.toLocaleString()} installs &middot; {e.years} yrs</span>}
                          {e.specialties.length > 0 && <span className="emp-tags">{e.specialties.map((t) => <i key={t}>{t}</i>)}</span>}
                          {e.bio && <span className="emp-bio">{e.bio}</span>}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="bk-anim">Pick a date and time</h2>
                  <div className="bk-when bk-anim">
                    <Calendar value={date} stylistId={stylistId}
                      onChange={(v) => { setDate(v); setTime('') }} />
                    <div className="slots">
                      <p className="slots-title">{date ? dLong(date) : 'Select a date to see times'}</p>
                      {loading && <div className="slot-grid">{Array.from({ length: 6 }).map((_, i) => <span key={i} className="slot sk" />)}</div>}
                      {!loading && date && (
                        <div className="slot-grid" role="radiogroup" aria-label="Time">
                          {slots.map((s) => (
                            <button key={s.time} role="radio" aria-checked={time === s.time} className="slot" disabled={!s.available} onClick={() => setTime(s.time)}>
                              {t12(s.time)}
                            </button>
                          ))}
                        </div>
                      )}
                      {!loading && !date && <p className="muted small">Days with a dot have free times.</p>}
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="bk-anim">Your details</h2>
                  <div className="bk-form bk-anim">
                    <label>Full name
                      <input value={d.name} onChange={set('name')} autoComplete="name" aria-invalid={touched && !!errors.name} />
                      {touched && errors.name && <small role="alert">{errors.name}</small>}
                    </label>
                    <label>Email
                      <input type="email" value={d.email} onChange={set('email')} autoComplete="email" inputMode="email" aria-invalid={touched && !!errors.email} />
                      {touched && errors.email && <small role="alert">{errors.email}</small>}
                    </label>
                    <label>Phone
                      <input type="tel" value={d.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" aria-invalid={touched && !!errors.phone} />
                      {touched && errors.phone && <small role="alert">{errors.phone}</small>}
                    </label>
                    <label>Which wig are we installing?
                      <select value={d.wig} onChange={set('wig')}>
                        <option value="own">I am bringing my own wig</option>
                        {products.map((p) => <option key={p.id} value={p.id}>{p.name} (${p.price})</option>)}
                      </select>
                    </label>
                    <label className="span2">Notes for your stylist (optional)
                      <textarea rows="3" value={d.notes} onChange={set('notes')} placeholder="Hairline, cut ideas, allergies" />
                    </label>
                  </div>
                </>
              )}

              <div className="bk-actions bk-anim">
                {step > 0 && <button className="btn ghost" onClick={() => setStep(step - 1)} disabled={status === 'busy'}>Back</button>}
                <button className="btn" onClick={next} disabled={!canNext || status === 'busy'}>
                  {step < 3 ? 'Continue' : status === 'busy' ? 'Booking...' : 'Confirm booking'}
                </button>
              </div>
            </div>

            <aside className="bk-sum" aria-label="Booking summary">
              <h3>Your booking</h3>
              <dl className="bk-sum-list">
                <div><dt>Service</dt><dd>{service ? service.name : <em>Not chosen yet</em>}</dd></div>
                <div><dt>Stylist</dt><dd>{stylist ? <span className="sum-emp"><Avatar e={stylist} size={26} />{stylist.name}</span> : <em>Not chosen yet</em>}</dd></div>
                <div><dt>When</dt><dd>{date && time ? `${dLong(date)}, ${t12(time)}` : <em>Not chosen yet</em>}</dd></div>
                {service && <div><dt>Duration</dt><dd>About {service.minutes} min</dd></div>}
                {step === 3 && <div><dt>Wig</dt><dd>{wig ? wig.name : 'Bringing my own'}</dd></div>}
              </dl>
              <div className="bk-total"><span>Installation</span><b>${service ? service.price : 0}</b></div>
              {wig && step === 3 && <p className="muted small">{wig.name} (${wig.price}) is added at checkout.</p>}
            </aside>
          </div>
        </>
      )}
    </section>
  )
}