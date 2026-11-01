import { expect, it } from 'vitest'
import { constrainObject, readObjectPositions } from './layout'
import { initialSave, parseWorldSave } from './world'
import { initialCloset, readCloset, swapSlots } from './wardrobe'
it('migra una partida anterior conservando personajes y recuerdos', () => {
  const { objectPositions: _layout, closetSlots: _closet, ...old } = initialSave
  const result = parseWorldSave(JSON.stringify({ ...old, collected: ['gift'], fed: true }))
  expect(result.characters).toEqual(old.characters)
  expect(result.collected).toEqual(['gift'])
  expect(result.fed).toBe(true)
  expect(result.objectPositions).toEqual({})
  expect(result.closetSlots).toEqual(initialCloset)
})
it('ignora solamente las posiciones dañadas', () => {
  expect(
    readObjectPositions({
      sofa: { x: 30, y: 60 },
      pet: { x: -1, y: 75 },
      other: { x: 40, y: 40 },
      gift: { x: 12, y: '60' },
    }),
  ).toEqual({ sofa: { x: 30, y: 60 } })
})
it('mantiene el objeto completo dentro de los bordes', () => {
  const scene = { width: 400, height: 800 },
    item = { width: 100, height: 200 }
  const topLeft = constrainObject({ x: -50, y: -50 }, item, scene)
  expect(topLeft.x).toBeCloseTo(14.5)
  expect(topLeft.y).toBe(26)
  expect(constrainObject({ x: 150, y: 150 }, item, scene)).toEqual({ x: 85.5, y: 99 })
})
it('intercambia espacios del armario sin perder prendas ni modificar el original', () => {
  const changed = swapSlots(initialCloset, 0, 5)
  expect(changed[0]).toBe(null)
  expect(changed[5]).toBe('rose')
  expect(changed.filter(Boolean).sort()).toEqual(initialCloset.filter(Boolean).sort())
  expect(initialCloset[0]).toBe('rose')
  expect(swapSlots(initialCloset, -1, 3)).toBe(initialCloset)
})
it('recupera solo el armario cuando los espacios tienen prendas duplicadas', () => {
  expect(readCloset(['rose', 'rose', 'gold', 'bow', 'crown', null])).toEqual(initialCloset)
  const result = parseWorldSave(
    JSON.stringify({
      ...initialSave,
      objectPositions: { table: { x: 50, y: 80 } },
      closetSlots: [],
    }),
  )
  expect(result.objectPositions.table).toEqual({ x: 50, y: 80 })
  expect(result.closetSlots).toEqual(initialCloset)
})
