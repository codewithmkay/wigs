import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './Navbar'
import Footer from './Footer'
import useSmoothScroll from '../hooks/useSmoothScroll'

export default function Layout() {
  const lenisRef = useSmoothScroll()
  const { pathname } = useLocation()

  // new page: jump to top, then let GSAP re-measure everything
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => clearTimeout(t)
  }, [pathname, lenisRef])

  return (
    <>
      <Navbar lenisRef={lenisRef} />
      <main>
        <Outlet />
      </main>
      <Footer lenisRef={lenisRef} />
    </>
  )
}