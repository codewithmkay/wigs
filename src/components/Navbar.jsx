import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const links = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/installation', 'Installation'],
  ['/book', 'Book'],
]

export default function Navbar({ lenisRef }) {
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()

  // close on route change
  useEffect(() => { setMenu(false) }, [pathname])

  // close if the screen grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia('(min-width:801px)')
    const fn = (e) => e.matches && setMenu(false)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  // scroll lock, link animation, Escape key
  useEffect(() => {
    lenisRef?.current?.[menu ? 'stop' : 'start']()
    document.documentElement.classList.toggle('lock', menu)
    const calm = window.matchMedia('(prefers-reduced-motion:reduce)').matches
    if (menu && !calm) {
      gsap.fromTo('.m-link,.m-foot', { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: 'power3.out', delay: 0.2 })
    }
    const esc = (e) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', esc)
    return () => {
      window.removeEventListener('keydown', esc)
      document.documentElement.classList.remove('lock')
    }
  }, [menu, lenisRef])

  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">velora</Link>

        <nav className="desk" aria-label="Main">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/installation">Installation</NavLink>
          <NavLink to="/book" className="pill">Book</NavLink>
        </nav>

        <div className="nav-r">
          <button
            className={'burger' + (menu ? ' on' : '')}
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu((m) => !m)}
          >
            <i /><i />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={'mmenu' + (menu ? ' on' : '')} aria-hidden={!menu}>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} tabIndex={menu ? 0 : -1} className="m-link">
            {label}
          </NavLink>
        ))}
        <div className="m-foot">
          <Link to="/book" className="btn" tabIndex={menu ? 0 : -1}>Book installation</Link>
          <p className="muted">Human hair wigs and expert installation.</p>
        </div>
      </div>
    </>
  )
}