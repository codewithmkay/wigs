import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Booking from '../components/Install/Booking'
import useScramble from '../hooks/useScramble'

gsap.registerPlugin(ScrollTrigger)

const PROCESS = [
  ['Prep', 'We wash, pluck and customize the lace before anything touches your hairline.'],
  ['Install', 'A secure fit and a melted hairline, checked in natural light.'],
  ['Aftercare', 'You leave with a care plan and a stylist you can message.'],
]
const FAQ = [
  ['How long does an install take?', 'Between 75 and 180 minutes, depending on the service. The time is shown on each service card.'],
  ['Can I bring my own wig?', 'Yes. Choose "I am bringing my own wig" on the details step, or pick the Revamp service.'],
  ['Can I pick my stylist?', 'Yes. Choose a specific stylist, or "First available" for the earliest open time.'],
  ['How long does an install last?', 'Usually four to six weeks with normal care. Your stylist will give you a plan.'],
  ['Do I need to prepare anything?', 'Arrive with clean, dry hair, and bring reference photos if you want a specific cut.'],
]

export default function Installation() {
  const root = useRef(null)
  const tag = useRef(null)
  useScramble(tag, 'Specialists. Real availability. Booked in a minute.')

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ins-title span', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out' })
      gsap.from('.ins-stats > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.5 })
      gsap.to('.ins-aurora', { xPercent: 12, yPercent: -10, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.from('.ins-reveal', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ins-after', start: 'top 80%', once: true },
      })
    }, root)
    return () => mm.revert()
  }, [])

  return (
    <div className="ins" ref={root}>
      <header className="ins-head">
        <div className="ins-aurora" aria-hidden="true" />
        <p className="sh-tag" ref={tag} aria-label="Specialists. Real availability. Booked in a minute." />
        <h1 className="ins-title" aria-label="Book your install">
          <div className="hl"><span>Book your</span></div>
          <div className="hl"><span>install.</span></div>
        </h1>
        <div className="ins-stats">
          <div><b>4,800+</b><span>installs done</span></div>
          <div><b>4.9</b><span>average rating</span></div>
          <div><b>5</b><span>specialists</span></div>
        </div>
      </header>

      <Booking />

      <section className="ins-after">
        <h2 className="ins-reveal">What happens at your appointment</h2>
        <ol className="ins-steps">
          {PROCESS.map(([t, s], i) => (
            <li key={t} className="ins-reveal"><b>{String(i + 1).padStart(2, '0')}</b><h3>{t}</h3><p className="muted">{s}</p></li>
          ))}
        </ol>

        <h2 className="ins-reveal ins-faq-h">Questions</h2>
        <div className="ins-faq ins-reveal">
          {FAQ.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p className="muted">{a}</p></details>
          ))}
        </div>
      </section>
    </div>
  )
}