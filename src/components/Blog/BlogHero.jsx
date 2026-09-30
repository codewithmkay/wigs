import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export default function BlogHero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.bl-tag', {
          y: 18,
          opacity: 0,
          duration: .7,
          ease: 'power3.out',
        })

        gsap.from('.bl-title span', {
          yPercent: 110,
          opacity: 0,
          duration: 1,
          stagger: .1,
          ease: 'power4.out',
        })

        gsap.from('.bl-lead', {
          y: 18,
          opacity: 0,
          duration: .7,
          delay: .35,
          ease: 'power3.out',
        })
      }, root)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <header className="bl-head" ref={root}>
      <p className="bl-tag">THE NYWELE JOURNAL</p>

      <h1 className="bl-title" aria-label="Hair. Style. Knowledge.">
        <span>Hair.</span>
        <span>Style.</span>
        <span>Knowledge.</span>
      </h1>

      <p className="bl-lead">
        Wig guides, hair care, installation tips and style inspiration
        to help you find and care for your perfect look.
      </p>
    </header>
  )
}