import { money } from '../../utils/money'
import { INSTALL_FEE } from './bookData'

export default function Cart({ items, service, setService, subtotal, fee, onQty, onRemove }) {
  const count = items.reduce((n, x) => n + x.qty, 0)

  return (
    <aside className="bo-card bo-cart" id="bo-cart" aria-labelledby="bo-h-cart">
      <header className="bo-cardhead">
        <span className="bo-step">02</span>
        <h2 id="bo-h-cart">Your cart <small>{count}</small></h2>
      </header>

      {items.length === 0 ? (
        <p className="bo-empty">Nothing here yet. Build a wig and tap <b>Add to cart</b>.</p>
      ) : (
        <>
          <ul className="bo-lines">
            {items.map((x) => (
              <li key={x.key}>
                <img src={x.image} alt="" />
                <div className="bo-linebody">
                  <b>{x.name}</b>
                  <span>{x.color} · {x.length}" · {x.density}</span>
                  <span>{x.lace} · {x.cap} cap</span>
                  <div className="bo-qty">
                    <button onClick={() => onQty(x.key, -1)} aria-label={`Less ${x.name}`} disabled={x.qty <= 1}>−</button>
                    <output aria-live="polite">{x.qty}</output>
                    <button onClick={() => onQty(x.key, 1)} aria-label={`More ${x.name}`} disabled={x.qty >= 5}>+</button>
                    <button className="bo-rm" onClick={() => onRemove(x.key)}>Remove</button>
                  </div>
                </div>
                <b className="bo-lineprice">{money(x.unit * x.qty)}</b>
              </li>
            ))}
          </ul>

          <fieldset className="bo-set bo-service">
            <legend>How do you want it?</legend>
            <label className={'bo-opt' + (service === 'install' ? ' on' : '')}>
              <input type="radio" name="service" checked={service === 'install'} onChange={() => setService('install')} />
              <span><b>Install at the studio</b><small>Prep, fit and style · +{money(INSTALL_FEE)}</small></span>
            </label>
            <label className={'bo-opt' + (service === 'ship' ? ' on' : '')}>
              <input type="radio" name="service" checked={service === 'ship'} onChange={() => setService('ship')} />
              <span><b>Pickup or delivery</b><small>We confirm delivery cost on WhatsApp</small></span>
            </label>
          </fieldset>

          <dl className="bo-totals">
            <div><dt>Wigs</dt><dd>{money(subtotal)}</dd></div>
            {fee > 0 && <div><dt>Installation</dt><dd>{money(fee)}</dd></div>}
            <div className="bo-grand"><dt>Total</dt><dd>{money(subtotal + fee)}</dd></div>
          </dl>

          <button className="bo-btn bo-full"
            onClick={() => document.getElementById('bo-checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            Continue to details
          </button>
        </>
      )}
    </aside>
  )
}