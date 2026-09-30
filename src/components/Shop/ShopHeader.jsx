import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { products } from '../../data/products'
import useScramble from '../../hooks/useScramble'
import { pad } from '../../data/shopConfig'

export default function ShopHeader({ count }) {
  const tagRef = useRef(null)
  const cntEl = useRef(null)
  const cnt = useRef({ v: products.length })

  useScramble(tagRef, '100% human hair. Pre-plucked. Ready to wear.')

  useEffect(() => {
    const t = gsap.to(cnt.current, {
      v: count, duration: 0.6, ease: 'power2.out',
      onUpdate: () => { if (cntEl.current) cntEl.current.textContent = pad(Math.round(cnt.current.v)) },
    })
    return () => t.kill()
  }, [count])

  return (
    <header className="sh-head">
      <div className="sh-aurora" aria-hidden="true" />
      <div>
        <p className="sh-tag" ref={tagRef} aria-label="100% human hair. Pre-plucked. Ready to wear." />
        <h1 className="sh-title" aria-label="Shop wigs">
          <div className="hl"><span>Shop</span></div>
          <div className="hl"><span>wigs</span></div> 
        </h1>
      </div>
      <div className="sh-count" aria-live="polite">
        <b ref={cntEl}>{pad(products.length)}</b>
        <span>of {pad(products.length)} wigs</span>
      </div>
    </header>
  )
}