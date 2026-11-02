import { expect, it } from 'vitest'
import { constrainCharacterPosition, FLOOR_START, isFloorPoint } from './movement'
import { roomDoors, rooms } from './house'

it('distingue la pared del suelo y rechaza destinos inválidos', () => {
  expect(isFloorPoint({ x: 50, y: 30 })).toBe(false)
  expect(isFloorPoint({ x: 50, y: FLOOR_START })).toBe(true)
  expect(isFloorPoint({ x: NaN, y: 80 })).toBe(false)
})
it('mantiene los pies en el suelo al arrastrar sin sacar el personaje de pantalla', () => {
  const scene = { width: 390, height: 844 },
    item = { width: 140, height: 240 }
  const point = constrainCharacterPosition({ x: -100, y: -100 }, item, scene)
  expect(point.y).toBe(FLOOR_START)
  expect((point.x * scene.width) / 100 - item.width / 2).toBeGreaterThanOrEqual(0)
  expect(constrainCharacterPosition({ x: 50, y: 200 }, item, scene).y).toBe(95)
})
it('las salidas y entradas de toda la casa están sobre suelo transitable', () => {
  for (const room of rooms)
    for (const door of roomDoors(room.id)) {
      expect(isFloorPoint(door.approach)).toBe(true)
      expect(isFloorPoint(door.entry)).toBe(true)
    }
})
