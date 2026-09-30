import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useScramble from '../../hooks/useScramble'
import { STATS } from './installData'

export default function InstallHero() {
  const tag = useRef(null)
  useScramble(tag, 'Specialists. Real availability. Booked in a minute.')

  return (
    <header className="in-hero">
      <div className="in-glow" aria-hidden="true" />

      <div className="in-copy">
        <p className="in-tag" ref={tag} aria-label="Specialists. Real availability. Booked in a minute." />
        <h1 className="in-title" aria-label="Installation done right">
          <div className="hl"><span>Installation</span></div>
          <div className="hl"><span>done right.</span></div>
        </h1>
        <p className="in-lead">A melted hairline, a secure fit and a stylist who talks you through it.</p>
        <Link to="/book" className="in-btn">Book your install</Link>
      </div>

      <figure className="in-photo">
        <img src="/wig2.jpeg" alt="" loading="eager" />
        <figcaption><b>4.9</b><span>average rating</span></figcaption>
      </figure>

      <div className="in-hero-foot">
        <div className="in-stats">
          {STATS.map(([b, s]) => <div key={s}><b>{b}</b><span>{s}</span></div>)}
        </div>
      </div>
    </header>
  )
}