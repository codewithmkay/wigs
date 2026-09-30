import { money } from '../../utils/money'
import { TEXTURES, LENGTHS, SORTS, MINP, MAXP } from '../../data/shopConfig'

export default function ShopDock({ q, texture, length, sort, max, view, active, setParam, changeView, clear }) {
  return (
    <div className="dock">
      <div className="dock-row">
        <div className="dsearch">
          <label htmlFor="f-q" className="sr">Search wigs</label>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input id="f-q" type="search" placeholder="Search name, color, lace" value={q}
            onChange={(e) => setParam('q', e.target.value, '')} />
        </div>
        <div className="views" role="group" aria-label="View">
          <button aria-pressed={view === 'grid'} onClick={() => changeView('grid')} aria-label="Grid view">
            <svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>
          </button>
          <button aria-pressed={view === 'big'} onClick={() => changeView('big')} aria-label="Large view">
            <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="7" /><rect x="4" y="14" width="16" height="6" /></svg>
          </button>
        </div>
      </div>

      <div className="dchips" role="group" aria-label="Filter by texture">
        {TEXTURES.map((t) => (
          <button key={t} className="dchip" aria-pressed={texture === t} onClick={() => setParam('texture', t, 'All')}>{t}</button>
        ))}
      </div>

      <div className="dock-row dock-sel">
        <label className="sr" htmlFor="f-length">Length</label>
        <select id="f-length" value={length} onChange={(e) => setParam('length', e.target.value, 'all')}>
          {LENGTHS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <label className="sr" htmlFor="f-sort">Sort</label>
        <select id="f-sort" value={sort} onChange={(e) => setParam('sort', e.target.value, 'featured')}>
          {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <label className="price" htmlFor="f-max">
          <span>Up to <b>{money(max)}</b></span>
          <input id="f-max" type="range" min={MINP} max={MAXP} step="500" value={max}
            onChange={(e) => setParam('max', e.target.value, MAXP)} />
        </label>
      </div>

      {active.length > 0 && (
        <div className="dactive">
          {active.map(([key, label, fb]) => (
            <button key={key} className="dtag" onClick={() => setParam(key, '', fb)} aria-label={`Remove filter ${label}`}>
              {label} <span aria-hidden="true">&times;</span>
            </button>
          ))}
          <button className="dclear" onClick={clear}>Clear all</button>
        </div>
      )}
    </div>
  )
}