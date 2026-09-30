export const COLORS = [
  ['Jet Black', '#141216', 0],
  ['Espresso', '#3a2620', 0],
  ['Natural Brown', '#6b4636', 0],
  ['Copper', '#b4562d', 500],
  ['Burgundy', '#6e1e3f', 500],
  ['Honey Blonde', '#d9a95a', 1000],
  ['Platinum Blonde', '#e6e3dc', 1500],
]
export const DENSITIES = [['150%', 'Natural', 0], ['180%', 'Full', 1000], ['200%', 'Extra full', 2000]]
export const LACES = [['5x5 Closure', 0], ['13x4 Lace Front', 500], ['HD Lace Front', 1000]]
export const CAPS = ['Small', 'Medium', 'Large']
export const LEN_MIN = 8
export const LEN_MAX = 30
export const PER_INCH = 150 // KSh per inch above or below the wig's base length
export const INSTALL_FEE = 2500
export const SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM']
export const STUDIO_WA = '254700000000' // country code + number, digits only

const colorDelta = (n) => (COLORS.find((c) => c[0] === n) || [0, 0, 0])[2]
const densityDelta = (n) => (DENSITIES.find((d) => d[0] === n) || [0, 0, 0])[2]
const laceDelta = (n) => (LACES.find((l) => l[0] === n) || [0, 0])[1]

export const defaults = (p) => ({
  color: COLORS.some((c) => c[0] === p.color) ? p.color : 'Jet Black',
  length: p.length,
  density: '150%',
  lace: LACES.some((l) => l[0] === p.lace) ? p.lace : '13x4 Lace Front',
  cap: 'Medium',
})

export const unitPrice = (p, o) =>
  Math.max(
    0,
    p.price +
      colorDelta(o.color) - colorDelta(defaults(p).color) +
      (o.length - p.length) * PER_INCH +
      densityDelta(o.density) +
      laceDelta(o.lace) - laceDelta(defaults(p).lace),
  )

export const lineKey = (p, o) => [p.id, o.color, o.length, o.density, o.lace, o.cap].join('|')