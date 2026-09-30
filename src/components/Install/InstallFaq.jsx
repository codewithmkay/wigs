import { FAQ } from './installData'

export default function InstallFaq() {
  return (
    <section className="in-sec in-faq">
      <div className="in-sec-head in-reveal">
        <span className="in-eye">FAQ</span>
        <h2>Questions</h2>
      </div>
      <div className="in-faq-list in-reveal">
        {FAQ.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>
    </section>
  )
}