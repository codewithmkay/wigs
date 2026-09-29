import { useEffect } from 'react'
import gsap from 'gsap'

export default function useScramble(ref, text) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.textContent = text
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const chars = '01<>/[]{}#*+'
    const o = { p: 0 }
    const tw = gsap.to(o, {
      p: 1, duration: 1.4, ease: 'none', delay: 0.4,
      onUpdate() {
        const n = Math.floor(o.p * text.length)
        el.textContent = text.slice(0, n) +
          [...text.slice(n)].map((c) => (c === ' ' ? ' ' : chars[(Math.random() * chars.length) | 0])).join('')
      },
      onComplete() { el.textContent = text },
    })
    return () => tw.kill()
  }, [text, ref])
}