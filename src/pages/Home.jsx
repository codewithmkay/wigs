import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Products from '../components/Products'
import useSmoothScroll from '../hooks/useSmoothScroll'

export default function Home() {
  const lenisRef = useSmoothScroll()

  return (
    <>
      <Navbar lenisRef={lenisRef} />
      <main>
        <Hero />
        <Marquee />
        <Products />
      </main>
    </>
  )
}