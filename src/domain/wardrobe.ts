export const garments = [
  { id: 'rose', label: 'Camiseta rosa', color: '#f18c9e', kind: 'shirt' },
  { id: 'mint', label: 'Camiseta menta', color: '#78bfad', kind: 'shirt' },
  { id: 'gold', label: 'Camiseta dorada', color: '#edb958', kind: 'shirt' },
  { id: 'bow', label: 'Lacito', color: '#ef92b1', kind: 'accessory' },
  { id: 'crown', label: 'Corona', color: '#ffcf71', kind: 'accessory' },
] as const
export type GarmentId = (typeof garments)[number]['id']
export type ClosetSlots = (GarmentId | null)[]
export const initialCloset: ClosetSlots = ['rose', 'mint', 'gold', 'bow', 'crown', null]
export function readCloset(input: unknown): ClosetSlots {
  if (
    !Array.isArray(input) ||
    input.length !== 6 ||
    !input.every((id) => id === null || garments.some((g) => g.id === id))
  )
    return [...initialCloset]
  const filled = input.filter((id) => id !== null)
  return filled.length === 5 && new Set(filled).size === 5 ? [...input] : [...initialCloset]
}
export function swapSlots(slots: ClosetSlots, from: number, to: number): ClosetSlots {
  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from < 0 ||
    to < 0 ||
    from >= slots.length ||
    to >= slots.length ||
    from === to
  )
    return slots
  const next = [...slots]
  ;[next[from], next[to]] = [next[to], next[from]]
  return next
}
