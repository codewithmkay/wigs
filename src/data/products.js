const img = (n) => `/wig${n}.jpeg`

export const products = [
  { id: '1', name: 'Nairobi Straight',  price: 28500, length: 24, texture: 'Straight', color: 'Jet Black',       lace: 'HD Lace Front',   image: img(1), tone: ['#211b20', '#7b4f42'] },
  { id: '2', name: 'Savanna Body Wave', price: 32000, length: 26, texture: 'Wavy',     color: 'Natural Brown',   lace: '13x4 Lace Front', image: img(2), tone: ['#3b2923', '#b98263'] },
  { id: '3', name: 'Kibera Bob',        price: 16500, length: 12, texture: 'Straight', color: 'Honey Blonde',    lace: '5x5 Closure',     image: img(3), tone: ['#5a4630', '#e8b86a'] },
  { id: '4', name: 'Mara Curls',        price: 34500, length: 20, texture: 'Curly',    color: 'Espresso',        lace: 'HD Lace Front',   image: img(4), tone: ['#241a1a', '#875844'] },
  { id: '5', name: 'Mombasa Copper',    price: 29500, length: 22, texture: 'Wavy',     color: 'Copper',          lace: '13x4 Lace Front', image: img(5), tone: ['#4a2214', '#d96f3f'] },
  { id: '6', name: 'Nairobi Platinum',  price: 38500, length: 28, texture: 'Straight', color: 'Platinum Blonde', lace: 'HD Lace Front',   image: img(6), tone: ['#343747', '#d9def0'] },
  { id: '7', name: 'Kisumu Coils',      price: 24000, length: 16, texture: 'Curly',    color: 'Jet Black',       lace: '5x5 Closure',     image: img(7), tone: ['#18161a', '#5b4a42'] },
  { id: '8', name: 'Westlands Pixie',   price: 14500, length: 8,  texture: 'Straight', color: 'Burgundy',        lace: '5x5 Closure',     image: img(8), tone: ['#3a0f26', '#a83d60'] },
]