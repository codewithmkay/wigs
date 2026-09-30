import { Link } from 'react-router-dom'

export default function InstallCta() {
  return (
    <section className="in-cta in-reveal">
      <h2>Ready when you are.</h2>
      <p>Pick a service, a stylist and a time. It takes about a minute.</p>
      <Link to="/book" className="in-btn">Book your install</Link>
    </section>
  )
}