import { employees } from './employees'

export const SLOTS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30']
export const CLOSED_DAYS = [0]   // studio closed on Sunday
export const BOOKING_DAYS = 60   // how far ahead people can book

const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h }
const p2 = (n) => String(n).padStart(2, '0')
export const iso = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`
export const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }

function empSlots(emp, dateISO) {
  const d = fromISO(dateISO)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  if (d < today || CLOSED_DAYS.includes(d.getDay()) || emp.off.includes(d.getDay()))
    return SLOTS.map((time) => ({ time, available: false }))
  const now = new Date()
  return SLOTS.map((time) => {
    const [h, m] = time.split(':').map(Number)
    const at = new Date(d); at.setHours(h, m, 0, 0)
    return { time, available: at > now && hash(emp.id + dateISO + time) % 4 !== 0 }
  })
}

// REPLACE with: GET /availability?stylistId=&date=  ->  [{ time, available }]
export function getSlots(stylistId, dateISO) {
  if (stylistId === 'any')
    return SLOTS.map((time, i) => ({ time, available: employees.some((e) => empSlots(e, dateISO)[i].available) }))
  return empSlots(employees.find((e) => e.id === stylistId), dateISO)
}

export const dayHasSlots = (stylistId, dateISO) => getSlots(stylistId, dateISO).some((s) => s.available)

// when "any" is chosen, pick the first free specialist for that slot
export function assign(stylistId, dateISO, time) {
  if (stylistId !== 'any') return stylistId
  const i = SLOTS.indexOf(time)
  return employees.find((e) => empSlots(e, dateISO)[i].available)?.id
}