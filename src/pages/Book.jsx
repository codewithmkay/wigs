import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Booking from '../components/Install/Booking'
import useScramble from '../hooks/useScramble'

gsap.registerPlugin(ScrollTrigger)

// EDIT THESE
const STUDIO = {
  address: 'Your studio address, Nairobi',
  hours: [['Mon to Fri', '9:00 AM to 6:00 PM'], ['Saturday', '9:00 AM to 5:00 PM'], ['Sunday', 'Closed']],
  whatsapp: 'https://wa.me/254700000000', // country code + number, digits only
}
const POLICIES = [
  ['How do I reschedule or cancel?', 'Message us on WhatsApp with your booking reference at least 24 hours before your appointment and we will move it or cancel it for you.'],
  ['Is a deposit required?', 'Edit this answer to match how you take payment (for example an M-Pesa deposit to hold the slot, with the balance paid at the studio).'],
  ['What if I am running late?', 'Message us as soon as you know. We hold your slot for 15 minutes, after that we may need to shorten the service or rebook.'],
  ['Can I bring someone with me?', 'Yes, one guest is welcome to wait with you.'],
]
const PREP = [
  ['Come with clean, dry hair', 'It makes the lace prep and the fit much easier.'],
  ['Bring reference photos', 'A cut, a color or a hairline you love. Your stylist works from it.'],
  ['Arrive ten minutes early', 'Time to settle in and talk through what you want.'],
]

export default function Book() {
  const root = useRef(null)
  const tag = useRef(null)
  useScramble(tag, 'Pick a service. Pick your stylist. Pick a time.')

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ins-title span', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out' })
      gsap.from('.bkp-chips > *', { y: 20, opacity: 0, duration: 0.7, stagger: 0.08, delay: 0.5 })
      gsap.to('.ins-aurora', { xPercent: 12, yPercent: -10, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.set('.ins-reveal', { y: 40, opacity: 0 })
      ScrollTrigger.batch('.ins-reveal', {
        start: 'top 90%', once: true,
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }),
      })
    }, root)
    return () => mm.revert()
  }, [])

  return (
    <div className="ins" ref={root}>
      <header className="ins-head">
        <div className="ins-aurora" aria-hidden="true" />
        <p className="sh-tag" ref={tag} aria-label="Pick a service. Pick your stylist. Pick a time." />
        <h1 className="ins-title" aria-label="Book your appointment">
          <div className="hl"><span>Book your</span></div>
          <div className="hl"><span>appointment.</span></div>
        </h1>
        <div className="bkp-chips">
          <span>Takes about a minute</span>
          <span>Choose your stylist</span>
          <span>Live availability</span>
          <span>Add to your calendar</span>
        </div>
      </header>

      <Booking />

      <section className="ins-sec">
        <h2 className="ins-reveal">Before you come in</h2>
        <div className="bkp-grid">
          {PREP.map(([t, s], i) => (
            <div key={t} className="bkp-card ins-reveal">
              <b className="bkp-n">{String(i + 1).padStart(2, '0')}</b>
              <h3>{t}</h3>
              <p className="muted">{s}</p>
            </div>
          ))}
        </div>

        <div className="bkp-studio">
          <div className="bkp-visit ins-reveal">
            <h3>Visit the studio</h3>
            <p>{STUDIO.address}</p>
            <dl>
              {STUDIO.hours.map(([d, h]) => <div key={d}><dt>{d}</dt><dd>{h}</dd></div>)}
            </dl>
            <div className="bk-actions">
              <a className="btn light" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STUDIO.address)}`} target="_blank" rel="noopener noreferrer">Get directions</a>
              <a className="btn light ghost" href={STUDIO.whatsapp} target="_blank" rel="noopener noreferrer">Message us</a>
            </div>
          </div>

          <div className="ins-faq ins-reveal">
            <h3 className="bkp-faq-h">Booking policy</h3>
            {POLICIES.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p className="muted">{a}</p></details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}