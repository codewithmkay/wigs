import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// EDIT THESE
const SOCIAL = {
  instagram: 'https://instagram.com/nywele_affordable_ke',
  tiktok: 'https://tiktok.com/@nywele_affordable_ke',
  whatsapp: 'https://wa.me/254700000000', // country code + number, digits only
}
const CONTACT = {
  email: 'hello@nyweleaffordableke.com',
  phone: '+254 700 000 000',
  hours: 'Mon to Sat, 9am to 6pm',
  place: 'Nairobi, Kenya',
}

const labels = { instagram: 'Instagram', tiktok: 'TikTok', whatsapp: 'WhatsApp' }
const icons = {
  instagram: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></svg>,
  tiktok: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>,
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
        y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 90%', once: true },
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
        <div className="f-bg" aria-hidden="true" />
        <div className="f-in">
          <div className="f-grid">
            <div className="f-brand f-reveal">
              <Link to="/" className="f-logo" aria-label="Nywele Affordable KE, home">
                <b>Nywele</b>
                <small>affordable_ke</small>
              </Link>
              <p>Human hair wigs and expert installation, made affordable.</p>

              {state === 'done' ? (
                <p className="f-ok" role="status">You are on the list. Thank you!</p>
              ) : (
                <form className="f-form" onSubmit={subscribe} noValidate>
                  <label htmlFor="f-email" className="sr">Email address</label>
                  <input
                    id="f-email" type="email" placeholder="Your email" value={email}
                    aria-invalid={state === 'error'} aria-describedby="f-err"
                    onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
                  />
                  <button type="submit" disabled={state === 'busy'}>{state === 'busy' ? '...' : 'Join'}</button>
                </form>
              )}
              {state === 'error' && <p id="f-err" className="f-err" role="alert">Enter a valid email.</p>}
            </div>

            <nav className="f-col f-reveal" aria-label="Explore">
              <h3>Explore</h3>
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/installation">Installation</Link>
              <Link to="/book">Book</Link>
            </nav>

            <div className="f-col f-reveal">
              <h3>Contact</h3>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
              <span>{CONTACT.place}</span>
              <span>{CONTACT.hours}</span>
            </div>

            <div className="f-col f-reveal">
              <h3>Follow</h3>
              <div className="f-social">
                {Object.keys(SOCIAL).map((k) => (
                  <a key={k} href={SOCIAL[k]} target="_blank" rel="noopener noreferrer" aria-label={labels[k]}>
                    {icons[k]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="f-bottom">
            <span>&copy; {new Date().getFullYear()} Nywele Affordable KE</span>
            <div className="f-legal">
              <Link to="/">Privacy</Link>
              <Link to="/">Terms</Link>
            </div>
            <button className="f-top-btn" onClick={toTop} aria-label="Back to top">
              Back to top
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            </button>
          </div>
        </div>
      </footer>

      <a className="wa-float" href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        {icons.whatsapp}
      </a>
    </>
  )
}