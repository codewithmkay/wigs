import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        desk: '(min-width:801px)',
        calm: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { desk, calm } = context.conditions
        if (calm) return // no animation for reduced-motion users

        // 1. intro: headline lines rise, buttons and hint fade in, image settles
        const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
        intro
          .from('.hero-bg', { scale: 1.25, duration: 2, ease: 'power3.out' }, 0)
          .from('.hl span', { yPercent: 110, duration: 1.1, stagger: 0.15 }, 0.2)
          .from('.hero-cta > *', { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.9)
          .from('.hero-hint', { opacity: 0, duration: 0.8 }, 1.3)

        // 2. scroll: pin the hero, shrink the image into a rounded frame
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: '+=100%',
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
            },
          })
          .to('.hero-frame', {
            clipPath: desk
              ? 'inset(12% 18% 12% 18% round 36px)'
              : 'inset(14% 6% 14% 6% round 24px)',
            ease: 'none',
          }, 0)
          .to('.hero-bg', { scale: 1.12, ease: 'none' }, 0)
          .to('.hero-txt', { yPercent: -30, opacity: 0, ease: 'none' }, 0)
          .to('.hero-hint', { opacity: 0, ease: 'none' }, 0)
      },
      root
    )

    return () => mm.revert()
  }, [])

  return (
    <section className="hero" ref={root}>
      <div className="hero-frame">
        <div className="hero-bg" />
      </div>

      <div className="hero-txt">
        <h1>
          <div className="hl"><span>Hair that</span></div>
          <div className="hl"><span>arrives before</span></div>
          <div className="hl"><span>you do.</span></div>
        </h1>
        <div className="hero-cta">
          <Link className="btn light" to="/shop">Shop the drop</Link>
          <Link className="btn light ghost" to="/book">Book installation</Link>
        </div>
      </div>

      <div className="hero-hint" aria-hidden="true">
        <span>Scroll</span><i />
      </div>
    </section>
  )
}