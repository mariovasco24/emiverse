import { expect, it } from 'vitest'
import { roomDoors, roomRoute, rooms } from './house'
import { initialSave, parseWorldSave } from './world'
it('todas las habitaciones están conectadas y las puertas tienen regreso', () => {
  for (const from of rooms)
    for (const to of rooms) expect(roomRoute(from.id, to.id).at(-1)).toBe(to.id)
  for (const room of rooms)
    for (const exit of roomDoors(room.id))
      expect(
        roomDoors(exit.to).some((back) => back.to === room.id && back.side !== exit.side),
      ).toBe(true)
})
it('las rutas lejanas recorren cada habitación intermedia', () => {
  expect(roomRoute('garden', 'bedroom')).toEqual(['garden', 'home', 'kitchen', 'bedroom'])
  expect(roomRoute('bedroom', 'home')).toEqual(['bedroom', 'kitchen', 'home'])
  expect(roomRoute('home', 'home')).toEqual(['home'])
})
it('cada puerta coloca la llegada al lado opuesto de la habitación', () => {
  for (const room of rooms)
    for (const door of roomDoors(room.id)) {
      expect(door.approach.y).toBe(door.entry.y)
      if (door.side === 'right') expect(door.entry.x).toBeLessThan(door.approach.x)
      else expect(door.entry.x).toBeGreaterThan(door.approach.x)
    }
})
it('migra sala y jardín conservando sus muebles y añade cocina y dormitorio vacíos', () => {
  const { currentRoom: _room, castPositions: _cast, ...old } = initialSave
  const loaded = parseWorldSave(
    JSON.stringify({
      ...old,
      castPositions: { home: { emily: { x: 60, y: 70 } }, garden: { emily: { x: 30, y: 80 } } },
      objectPositions: { sofa: { x: 40, y: 60 } },
    }),
  )
  expect(loaded.currentRoom).toBe('home')
  expect(loaded.castPositions).toEqual({
    home: { emily: { x: 60, y: 70 } },
    garden: { emily: { x: 30, y: 80 } },
    kitchen: {},
    bedroom: {},
    shop: {},
  })
  expect(loaded.objectPositions.sofa).toEqual({ x: 40, y: 60 })
})
it('restaura la habitación actual y tolera identificadores de habitación inválidos', () => {
  expect(
    parseWorldSave(JSON.stringify({ ...initialSave, currentRoom: 'bedroom' })).currentRoom,
  ).toBe('bedroom')
  expect(
    parseWorldSave(JSON.stringify({ ...initialSave, currentRoom: 'unknown' })).currentRoom,
  ).toBe('home')
})
