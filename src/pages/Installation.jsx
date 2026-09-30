import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InstallHero from '../components/Install/InstallHero'
import InstallProcess from '../components/Install/InstallProcess'
import InstallFaq from '../components/Install/InstallFaq'
import InstallCta from '../components/Install/InstallCta'

gsap.registerPlugin(ScrollTrigger)

export default function Installation() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.in-title span', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out' })
      gsap.from('.in-hero-foot > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.5 })
      gsap.to('.in-glow', { xPercent: 10, yPercent: -8, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' })

      gsap.set('.in-reveal', { y: 40, opacity: 0 })
      ScrollTrigger.batch('.in-reveal', {
        start: 'top 90%', once: true,
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }),
      })
    }, root)
    return () => mm.revert()
  }, [])

  return (
    <div className="in" ref={root}>
      <InstallHero />
      <InstallProcess />
      <InstallFaq />
      <InstallCta />
    </div>
  )
}