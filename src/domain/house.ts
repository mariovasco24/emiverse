import type { Point } from './layout'
export const rooms = [
  { id: 'garden', label: 'Jardín', region: 'Escenario del jardín', tone: '#a8d5a0' },
  { id: 'home', label: 'Casita', region: 'Escenario de la casita', tone: '#f3c69f' },
  { id: 'kitchen', label: 'Cocina', region: 'Escenario de la cocina', tone: '#a8d6c8' },
  { id: 'bedroom', label: 'Dormitorio', region: 'Escenario del dormitorio', tone: '#cbb5e0' },
] as const
export type RoomId = (typeof rooms)[number]['id']
export type Door = {
  from: RoomId
  to: RoomId
  side: 'left' | 'right'
  approach: Point
  entry: Point
}
export function isRoom(value: unknown): value is RoomId {
  return rooms.some((room) => room.id === value)
}
export function roomDoors(room: RoomId): Door[] {
  const index = rooms.findIndex((r) => r.id === room)
  return (['left', 'right'] as const).flatMap((side) => {
    const next = rooms[index + (side === 'left' ? -1 : 1)]
    return next
      ? [
          {
            from: room,
            to: next.id,
            side,
            approach: { x: side === 'left' ? 2 : 98, y: 83 },
            entry: { x: side === 'left' ? 78 : 22, y: 83 },
          },
        ]
      : []
  })
}
export function roomRoute(from: RoomId, to: RoomId): RoomId[] {
  const queue: RoomId[][] = [[from]],
    visited = new Set<RoomId>()
  while (queue.length) {
    const path = queue.shift()!,
      room = path[path.length - 1]
    if (room === to) return path
    if (visited.has(room)) continue
    visited.add(room)
    for (const door of roomDoors(room)) if (!visited.has(door.to)) queue.push([...path, door.to])
  }
  return []
}
