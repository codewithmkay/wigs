import { products } from '../../data/products'
import ShopCard from './ShopCard'

export default function ShopGrid({ list, view, onReset }) {
  if (!list.length) {
    return (
      <div className="sh-empty">
        <h2>Nothing in range.</h2>
        <p className="muted">No wigs match those filters. Loosen one and try again.</p>
        <button className="btn" onClick={onReset}>Reset everything</button>
      </div>
    )
  }

  return (
    <div className={'sgrid' + (view === 'big' ? ' big' : '')}>
      {list.map((p) => <ShopCard key={p.id} p={p} i={products.findIndex((x) => x.id === p.id)} />)}
    </div>
  )
}