import { expect, it } from 'vitest'
import { moveCargo, products, readInventory, type CargoItem } from './inventory'
import { initialSave, parseWorldSave } from './world'
it('migra partidas anteriores sin borrar personajes, muebles ni ropa', () => {
  const { inventory: _inventory, ...old } = initialSave
  const saved = parseWorldSave(
    JSON.stringify({ ...old, collected: ['gift'], objectPositions: { sofa: { x: 40, y: 60 } } }),
  )
  expect(saved.inventory).toEqual([])
  expect(saved.characters).toEqual(old.characters)
  expect(saved.closetSlots).toEqual(old.closetSlots)
  expect(saved.objectPositions.sofa).toEqual({ x: 40, y: 60 })
  expect(saved.castPositions.shop).toEqual({})
})
it('guarda comida y juguetes sin duplicarlos ni perder su identidad', () => {
  const items: CargoItem[] = [
    ...products.map((p) => ({ id: p.id, kind: p.id, place: 'bag' as const })),
    { id: 'world-pet', kind: 'pet', place: 'bag' },
  ]
  for (const item of items) {
    const stored = moveCargo(items, item.id, 'fridge')
    expect(stored).toHaveLength(items.length)
    expect(stored.find((i) => i.id === item.id)).toEqual({ ...item, place: 'fridge' })
    expect(moveCargo(stored, item.id, 'bag').find((i) => i.id === item.id)).toEqual(item)
  }
  expect(items.every((i) => i.place === 'bag')).toBe(true)
})
it('permite más de una unidad de un producto y no limita la nevera a comida', () => {
  let items: CargoItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: `milk-${i}`,
    kind: 'milk',
    place: 'bag',
  }))
  items.push({ id: 'bear', kind: 'toy', place: 'bag' })
  for (const item of items) items = moveCargo(items, item.id, 'fridge')
  expect(readInventory(items)).toHaveLength(31)
  expect(items.every((i) => i.place === 'fridge')).toBe(true)
})
it('deja un objeto en una habitación y recupera su punto al recargar', () => {
  const placed = moveCargo([{ id: 'apple1', kind: 'apple', place: 'bag' }], 'apple1', 'bedroom', {
    x: 60,
    y: 80,
  })
  const saved = parseWorldSave(JSON.stringify({ ...initialSave, inventory: placed }))
  expect(saved.inventory).toEqual(placed)
  expect(moveCargo(placed, 'apple1', 'fridge')[0].point).toBeUndefined()
})
it('ordena entre objetos de un contenedor sin modificar otros contenedores', () => {
  const items: CargoItem[] = [
    { id: 'a', kind: 'apple', place: 'fridge' },
    { id: 'b', kind: 'milk', place: 'bag' },
    { id: 'c', kind: 'toy', place: 'fridge' },
  ]
  expect(moveCargo(items, 'c', 'fridge', undefined, 'a').map((i) => i.id)).toEqual(['c', 'a', 'b'])
  expect(moveCargo(items, 'unknown', 'bag')).toBe(items)
  expect(moveCargo(items, 'a', 'fridge', undefined, 'a')).toBe(items)
})
it('descarta registros corruptos y duplicados conservando todos los objetos válidos', () => {
  expect(
    readInventory([
      { id: 'a', kind: 'apple', place: 'fridge' },
      { id: 'a', kind: 'milk', place: 'bag' },
      { id: 'x', kind: 'bad', place: 'bag' },
      { id: 'fake', kind: 'pet', place: 'bag' },
      { id: 'world-pet', kind: 'pet', place: 'fridge' },
      { id: 'room', kind: 'milk', place: 'bad-room' },
    ]),
  ).toEqual([
    { id: 'a', kind: 'apple', place: 'fridge' },
    { id: 'world-pet', kind: 'pet', place: 'fridge' },
  ])
  expect(
    readInventory([{ id: 'a', kind: 'apple', place: 'home', point: { x: -10, y: NaN } }])[0].point,
  ).toEqual({ x: 55, y: 86 })
})
