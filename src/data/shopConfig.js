import { products } from './products'

export const TEXTURES = ['All', 'Straight', 'Wavy', 'Curly']
export const LENGTHS = [['all', 'Any length'], ['short', 'Short (up to 14")'], ['medium', 'Medium (15 to 22")'], ['long', 'Long (23"+)']]
export const SORTS = [['featured', 'Featured'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['long', 'Length: longest first']]

const prices = products.map((p) => p.price)
export const MAXP = Math.ceil(Math.max(...prices) / 1000) * 1000
export const MINP = Math.floor(Math.min(...prices) / 1000) * 1000

export const inRange = (n, k) => (k === 'short' ? n <= 14 : k === 'medium' ? n > 14 && n <= 22 : k === 'long' ? n > 22 : true)
export const pad = (n) => String(n).padStart(2, '0')
export const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches