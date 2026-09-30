import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// phones can trigger a plain crossfade if "reduce motion" is on in their settings.
// set to false to always play the full animation.
const RESPECT_REDUCED_MOTION = true

// stops the address bar hiding/showing from re-calculating the pin on phones
ScrollTrigger.config({ ignoreMobileResize: true })

export default function Hero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        desk: '(min-width:801px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { desk } = context.conditions
        const calm = RESPECT_REDUCED_MOTION && context.conditions.reduce

        const scrollTrigger = {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + root.current.offsetHeight * (calm ? 1.2 : desk ? 2.4 : 2),
          scrub: calm ? true : 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }

        /* ---- reduced motion: simple crossfade ---- */
        if (calm) {
          gsap.set('.l2', { autoAlpha: 0 })
          gsap
            .timeline({ defaults: { ease: 'none' }, scrollTrigger })
            .to('.l2', { autoAlpha: 1, duration: 1 }, 0)
            .to('.h-a', { opacity: 0, duration: 0.5 }, 0.2)
            .to('.h-b', { opacity: 1, duration: 0.5 }, 0.5)
          return
        }

        /* ---- initial states ---- */
        gsap.set('.l2', { yPercent: 100, autoAlpha: 1 })
        gsap.set('.l2-in', { yPercent: -100 })
        gsap.set('.h-b', { opacity: 1 })
        gsap.set('.h-b .hl > span', { yPercent: 110 })

        /* ---- intro (page load) ---- */
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from('.hero-intro', { scale: 1.2, duration: 2, ease: 'power3.out' }, 0)
          .from('.h-a .hl > span', { yPercent: 110, duration: 1.1, stagger: 0.15 }, 0.2)
          .from('.hero-cta > *', { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.9)
          .from('.hero-bar', { opacity: 0, duration: 0.8 }, 1.3)

        /* ---- scroll sequence ---- */
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger })

          // hero1.jpg slides up over hero.jpg (layer up, inner image down = wipe)
          .to('.l2', { yPercent: 0, duration: 1.2, ease: 'power2.inOut' }, 0)
          .to('.l2-in', { yPercent: 0, duration: 1.2, ease: 'power2.inOut' }, 0)

          // parallax on the images themselves
          .fromTo('.img-2', { scale: 1.2 }, { scale: 1, duration: 1.2 }, 0)
          .fromTo('.img-1', { scale: 1 }, { scale: 1.12, yPercent: -4, duration: 1.2 }, 0)

          // headline A out, headline B in
          .to('.h-a .hl > span', { yPercent: -110, duration: 0.5, stagger: 0.08, ease: 'power2.in' }, 0.15)
          .to('.h-b .hl > span', { yPercent: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 0.75)
          .to('.hero-cta', { opacity: 0, y: -10, duration: 0.3 }, 0.1)
          .to('.hero-cta', { opacity: 1, y: 0, duration: 0.3 }, 1.0)
          .to('.hero-hint', { opacity: 0, duration: 0.3 }, 0)

          // shrink into a rounded card
          .to('.hero-frame', {
            clipPath: desk
              ? 'inset(12% 18% 12% 18% round 36px)'
              : 'inset(14% 6% 14% 6% round 24px)',
            duration: 1,
          }, 1.6)
          .to('.hero-zoom', { scale: 1.06, duration: 1 }, 1.6)
          .to('.hero-txt', { yPercent: -25, opacity: 0, duration: 0.8 }, 1.7)

          // progress line
          .fromTo('.hero-bar i', { scaleX: 0 }, { scaleX: 1, duration: 2.6 }, 0)
      },
      root
    )

    /* recalc pin positions once images have loaded */
    const refresh = () => ScrollTrigger.refresh()
    root.current.querySelectorAll('img').forEach((im) => {
      if (!im.complete) im.addEventListener('load', refresh, { once: true })
    })
    window.addEventListener('load', refresh, { once: true })
    const t = setTimeout(refresh, 500)

    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  return (
    <section className="hero" ref={root}>
      <div className="hero-frame">
        <div className="hero-zoom">
          <div className="hero-intro">
            <div className="layer l1">
              <img className="img img-1" src="/hero.jpg" alt="" decoding="async" />
            </div>
            <div className="layer l2">
              <div className="l2-in">
                <img className="img img-2" src="/hero1.jpg" alt="" decoding="async" />
              </div>
            </div>
          </div>
        </div>
        <div className="hero-shade" />
      </div>

      <div className="hero-txt">
        <div className="hero-heads">
          <h1 className="h-a">
            <span className="hl"><span>Hair that</span></span>
            <span className="hl"><span>arrives before</span></span>
            <span className="hl"><span>you do.</span></span>
          </h1>
          <h1 className="h-b" aria-hidden="true">
            <span className="hl"><span>Installed</span></span>
            <span className="hl"><span>flawlessly by</span></span>
            <span className="hl"><span>the experts.</span></span>
          </h1>
        </div>
        <div className="hero-cta">
          <Link className="btn light" to="/shop">Shop the drop</Link>
          <Link className="btn light ghost" to="/book">Book installation</Link>
        </div>
      </div>

      <div className="hero-hint" aria-hidden="true">
        <span>Scroll</span><i />
      </div>

      <div className="hero-bar" aria-hidden="true"><i /></div>
    </section>
  )
}