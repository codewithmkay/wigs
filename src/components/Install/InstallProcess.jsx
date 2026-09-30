import { PROCESS, INCLUDED } from './installData'

export default function InstallProcess() {
  return (
    <section className="in-sec">
      <div className="in-sec-head in-reveal">
        <span className="in-eye">The process</span>
        <h2>What happens at your appointment</h2>
      </div>

      <ol className="in-steps">
        {PROCESS.map(([t, s], i) => (
          <li key={t} className="in-reveal">
            <b className="in-num">{String(i + 1).padStart(2, '0')}</b>
            <h3>{t}</h3>
            <p>{s}</p>
          </li>
        ))}
      </ol>

      <div className="in-incl in-reveal">
        <h3>Every install includes</h3>
        <ul>
          {INCLUDED.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </section>
  )
}