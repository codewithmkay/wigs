import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import useScramble from '../hooks/useScramble'
import WigPicker from '../components/book/WigPicker'
import Cart from '../components/book/Cart'
import Checkout from '../components/book/Checkout'
import { INSTALL_FEE } from '../components/book/bookData'

const KEY = 'nywele-cart'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export default function Book() {
  const root = useRef(null)
  const tag = useRef(null)

  const [items, setItems] = useState(load)
  const [service, setService] = useState('install')

  useScramble(tag, 'Choose your wig. Make it yours. We handle the rest.')

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.bo-tag', {
        opacity: 0,
        y: 12,
        duration: 0.7,
        ease: 'power3.out',
      })

      gsap.from('.bo-title span', {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
      })

      gsap.from('.bo-intro', {
        opacity: 0,
        y: 15,
        duration: 0.7,
        delay: 0.25,
        ease: 'power3.out',
      })

      gsap.from('.bo-card', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.35,
        ease: 'power3.out',
      })
    }, root)

    return () => mm.revert()
  }, [])

  const add = (item) => {
    setItems((current) => {
      const existing = current.find((x) => x.key === item.key)

      if (existing) {
        return current.map((x) =>
          x.key === item.key
            ? { ...x, qty: Math.min(5, x.qty + 1) }
            : x
        )
      }

      return [...current, { ...item, qty: 1 }]
    })
  }

  const qty = (key, amount) => {
    setItems((current) =>
      current.map((x) =>
        x.key === key
          ? {
              ...x,
              qty: Math.min(5, Math.max(1, x.qty + amount)),
            }
          : x
      )
    )
  }

  const remove = (key) => {
    setItems((current) => current.filter((x) => x.key !== key))
  }

  const subtotal = items.reduce(
    (total, item) => total + item.unit * item.qty,
    0
  )

  const fee =
    service === 'install' && items.length
      ? INSTALL_FEE
      : 0

  return (
    <main className="bo" ref={root}>
      <header className="bo-head">
        <p
          className="bo-tag"
          ref={tag}
          aria-label="Choose your wig. Make it yours. We handle the rest."
        />

        <h1 className="bo-title" aria-label="Build your wig">
          <span>Build your</span>
          <span>wig.</span>
        </h1>

        <p className="bo-intro">
          Choose a style, customize the details, then book your
          installation or delivery.
        </p>
      </header>

      <div className="bo-layout">
        <section className="bo-a-pick">
          <WigPicker onAdd={add} />
        </section>

        <aside className="bo-a-cart">
          <Cart
            items={items}
            service={service}
            setService={setService}
            subtotal={subtotal}
            fee={fee}
            onQty={qty}
            onRemove={remove}
          />
        </aside>

        <section className="bo-a-check">
          <Checkout
            items={items}
            service={service}
            total={subtotal + fee}
            onDone={() => setItems([])}
          />
        </section>
      </div>
    </main>
  )
}