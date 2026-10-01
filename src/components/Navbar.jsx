import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const links = [
  ['/', 'Home'],
  ['/blog', 'Blog'],
  ['/shop', 'Shop'],
  ['/installation', 'Installation'],
  ['/book', 'Book'],
]

const LOGO_SRC = '/logo1.jpg'

export default function Navbar({ lenisRef }) {
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoOk, setLogoOk] = useState(true)
  const { pathname } = useLocation()

  useEffect(() => {
    setMenu(false)
  }, [pathname])

  useEffect(() => {
    const mq = window.matchMedia('(min-width:801px)')
    const fn = (e) => e.matches && setMenu(false)

    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    lenisRef?.current?.[menu ? 'stop' : 'start']()

    document.documentElement.classList.toggle('lock', menu)

    const calm = window.matchMedia(
      '(prefers-reduced-motion:reduce)'
    ).matches

    if (menu && !calm) {
      gsap.fromTo(
        '.m-link,.m-foot',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.2,
        }
      )
    }

    const esc = (e) => {
      if (e.key === 'Escape') setMenu(false)
    }

    window.addEventListener('keydown', esc)

    return () => {
      window.removeEventListener('keydown', esc)
      document.documentElement.classList.remove('lock')
    }
  }, [menu, lenisRef])

  return (
    <>
      <header
        className={
          'nav' +
          (scrolled ? ' scrolled' : '') +
          (menu ? ' open' : '')
        }
      >
        <div className="nav-in">
          <Link
            to="/"
            className="logo"
            aria-label="Nywele Affordable KE – Home"
          >
            <span className="logo-mark">
              {logoOk ? (
                <img
                  src={LOGO_SRC}
                  alt=""
                  onError={() => setLogoOk(false)}
                />
              ) : (
                <b>N</b>
              )}
            </span>

            <span className="logo-txt">
              <b>Nywele</b>
              <small>affordable_ke</small>
            </span>
          </Link>

          <nav className="desk" aria-label="Main">
            <NavLink to="/" end>
              Home
            </NavLink>

            <NavLink to="/blog">
              Blog
            </NavLink>

            <NavLink to="/shop">
              Shop
            </NavLink>

            <NavLink to="/installation">
              Installation
            </NavLink>

            <NavLink to="/book" className="pill">
              Book now
            </NavLink>
          </nav>

          <div className="nav-r">
            <button
              className={'burger' + (menu ? ' on' : '')}
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu((m) => !m)}
            >
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={'mmenu' + (menu ? ' on' : '')}
        aria-hidden={!menu}
      >
        {links.map(([to, label], i) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            tabIndex={menu ? 0 : -1}
            className="m-link"
          >
            <span className="m-num">
              0{i + 1}
            </span>

            {label}
          </NavLink>
        ))}

        <div className="m-foot">
          <Link
            to="/book"
            className="btn"
            tabIndex={menu ? 0 : -1}
          >
            Book installation
          </Link>

          <p className="muted">
            Human hair wigs and expert installation.
          </p>
        </div>
      </div>
    </>
  )
}