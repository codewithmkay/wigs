import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProductCard from './ProductCard'
import { products } from '../../data/products'

gsap.registerPlugin(ScrollTrigger)

export default function Products() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.products-head > *', {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.products-head', start: 'top 85%', once: true },
      })
      gsap.set('.pcard', { y: 50, opacity: 0 })
      ScrollTrigger.batch('.pcard', {
        start: 'top 92%',
        once: true,
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }),
      })
    }, root)
    return () => mm.revert()
  }, [])

  return (
    <section className="products" ref={root}>
      <div className="products-head">
        <h2>Featured wigs</h2>
        <Link to="/shop" className="btn ghost">Shop all</Link>
      </div>
      <div className="pgrid">
        {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}