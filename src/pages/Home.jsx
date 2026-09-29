import Navbar from '../components/Navbar'
import Hero from '../components/Home/Hero'
import Marquee from '../components/Home/Marquee'
import Products from '../components/Home/Products'
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