import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// EDIT THESE
const SOCIAL = {
  instagram: 'https://instagram.com/yourhandle',
  tiktok: 'https://tiktok.com/@yourhandle',
  facebook: 'https://facebook.com/yourpage',
  whatsapp: 'https://wa.me/15551234567', // country code + number, digits only
}
const CONTACT = { email: 'hello@velora.com', phone: '+1 555 123 4567', hours: 'Mon to Sat, 9am to 6pm' }

const TRUST = [
  ['Free shipping', 'On every wig order'],
  ['30-day returns', 'Unworn wigs, no fuss'],
  ['100% human hair', 'Pre-plucked hairline'],
  ['Secure checkout', 'Your details stay private'],
]

const labels = { instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook', whatsapp: 'WhatsApp' }
const icons = {
  instagram: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></svg>,
  tiktok: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>,
  facebook: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
  whatsapp: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>,
}

export default function Footer({ lenisRef }) {
  const root = useRef(null)
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | error | busy | done

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.f-reveal', {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })
      gsap.from('.f-mark span', {
        yPercent: 60, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.f-mark', start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
    }, root)
    return () => mm.revert()
  }, [])

  const subscribe = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState('error')
    setState('busy')
    // TODO: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
    await new Promise((r) => setTimeout(r, 600))
    setState('done')
    setEmail('')
  }

  const toTop = () =>
    lenisRef?.current ? lenisRef.current.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <footer className="footer" ref={root}>
        <ul className="f-trust">
          {TRUST.map(([t, s]) => (
            <li key={t} className="f-reveal"><b>{t}</b><span>{s}</span></li>
          ))}
        </ul>

        <div className="f-top">
          <h2 className="f-reveal">Ready for your next look?</h2>
          <div className="f-reveal f-actions">
            <Link to="/shop" className="btn light">Shop wigs</Link>
            <Link to="/book" className="btn light ghost">Book installation</Link>
          </div>
        </div>

        <div className="f-grid">
          <div className="f-reveal f-brand">
            <b className="logo">velora</b>
            <p>Human hair wigs and expert installation. Join the list for new drops and offers.</p>
            {state === 'done' ? (
              <p className="f-ok" role="status">You are on the list. Check your inbox.</p>
            ) : (
              <form className="f-form" onSubmit={subscribe} noValidate>
                <label htmlFor="f-email" className="sr">Email address</label>
                <input id="f-email" type="email" placeholder="Your email" value={email}
                  aria-invalid={state === 'error'} aria-describedby="f-err"
                  onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }} />
                <button type="submit" className="btn light" disabled={state === 'busy'}>
                  {state === 'busy' ? 'Joining...' : 'Join'}
                </button>
              </form>
            )}
            {state === 'error' && <p id="f-err" className="f-err" role="alert">Enter a valid email, like name@example.com.</p>}
          </div>

          <nav className="f-reveal f-col" aria-label="Shop">
            <h3>Shop</h3>
            <Link to="/shop">All wigs</Link>
            <Link to="/shop?texture=Straight">Straight</Link>
            <Link to="/shop?texture=Wavy">Wavy</Link>
            <Link to="/shop?texture=Curly">Curly</Link>
          </nav>

          <nav className="f-reveal f-col" aria-label="Services">
            <h3>Services</h3>
            <Link to="/installation">Installation</Link>
            <Link to="/book">Book a stylist</Link>
            <Link to="/installation">Aftercare and FAQ</Link>
          </nav>

          <div className="f-reveal f-col">
            <h3>Contact</h3>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
            <span>{CONTACT.hours}</span>
            <div className="f-social">
              {Object.keys(SOCIAL).map((k) => (
                <a key={k} href={SOCIAL[k]} target="_blank" rel="noopener noreferrer" aria-label={labels[k]}>{icons[k]}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="f-mark" aria-hidden="true"><span>velora</span></div>

        <div className="f-bottom">
          <span>&copy; {new Date().getFullYear()} Velora. All rights reserved.</span>
          <div className="f-legal">
            <Link to="/">Privacy</Link><Link to="/">Terms</Link><Link to="/">Shipping and returns</Link>
          </div>
          <button className="f-top-btn" onClick={toTop} aria-label="Back to top">
            Back to top
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </button>
        </div>
      </footer>

      <a className="wa-float" href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        {icons.whatsapp}
      </a>
    </>
  )
}