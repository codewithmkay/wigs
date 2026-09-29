import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const words = ['100% human hair', 'Lace front', 'Pre-plucked', 'Free shipping', 'Expert installation']

export default function Marquee() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.to('.marq-track', { xPercent: -50, repeat: -1, duration: 28, ease: 'none' })

      // speed up while the page is scrolling, then ease back to normal
      ScrollTrigger.create({
        onUpdate: (self) => {
          const boost = Math.min(Math.abs(self.getVelocity()) / 300, 4)
          gsap.to(tween, {
            timeScale: 1 + boost,
            duration: 0.2,
            overwrite: true,
            onComplete: () => gsap.to(tween, { timeScale: 1, duration: 1 }),
          })
        },
      })
    }, root)
    return () => mm.revert()
  }, [])

  const group = (hidden) => (
    <div className="marq-group" aria-hidden={hidden}>
      {words.map((w) => <span key={w}>{w}</span>)}
    </div>
  )

  return (
    <div className="marq" ref={root}>
      <div className="marq-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}