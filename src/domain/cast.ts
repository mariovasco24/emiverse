import type { Point } from './layout'
import type { Character } from './world'
export type RoomId = 'home' | 'garden'
export type CastPositions = Record<RoomId, Record<string, Point>>
export const guestLeo: Character = {
  id: 'guest-leo',
  name: 'Leo',
  skin: '#b97850',
  shirt: '#78bfad',
  hair: 'short',
  accessory: 'none',
}
export function actorDefault(id: string, characters: Character[]): Point {
  if (id === guestLeo.id) return { x: 20, y: 74 }
  const index = Math.max(
    0,
    characters.findIndex((c) => c.id === id),
  )
  return (
    [
      { x: 48, y: 76 },
      { x: 60, y: 60 },
      { x: 35, y: 86 },
      { x: 80, y: 84 },
      { x: 27, y: 62 },
    ][index] || { x: 50, y: 80 }
  )
}
export function readCastPositions(input: unknown, characters: Character[]): CastPositions {
  const result: CastPositions = { home: {}, garden: {} }
  if (!input || typeof input !== 'object') return result
  const ids = new Set([...characters.map((c) => c.id), guestLeo.id])
  for (const room of ['home', 'garden'] as const) {
    const positions = (input as Record<string, unknown>)[room]
    if (!positions || typeof positions !== 'object' || Array.isArray(positions)) continue
    for (const [id, point] of Object.entries(positions)) {
      if (!ids.has(id) || !point || typeof point !== 'object') continue
      const { x, y } = point as Point
      if (Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 100 && y >= 0 && y <= 100)
        result[room][id] = { x, y }
    }
  }
  return result
}
