import { expect, it } from 'vitest'
import { actorDefault, guestLeo, readCastPositions } from './cast'
import { initialSave, parseWorldSave } from './world'
it('añade posiciones independientes sin borrar partidas anteriores', () => {
  const { castPositions: _positions, ...old } = initialSave
  const saved = parseWorldSave(JSON.stringify({ ...old, collected: ['gift'] }))
  expect(saved.castPositions).toEqual({ home: {}, garden: {}, kitchen: {}, bedroom: {}, shop: {} })
  expect(saved.characters).toEqual(old.characters)
  expect(saved.collected).toEqual(['gift'])
})
it('carga solo posiciones válidas de personajes existentes o de Leo', () => {
  expect(
    readCastPositions(
      {
        home: {
          emily: { x: 40, y: 70 },
          [guestLeo.id]: { x: 25, y: 60 },
          unknown: { x: 20, y: 50 },
        },
        garden: { emily: { x: -20, y: 100 } },
      },
      initialSave.characters,
    ),
  ).toEqual({
    home: { emily: { x: 40, y: 70 }, [guestLeo.id]: { x: 25, y: 60 } },
    garden: {},
    kitchen: {},
    bedroom: {},
    shop: {},
  })
})
it('asigna puntos iniciales diferentes a cada personaje', () => {
  const characters = [...initialSave.characters, { ...initialSave.characters[0], id: 'luna' }]
  expect(actorDefault('luna', characters)).not.toEqual(actorDefault('emily', characters))
  expect(actorDefault(guestLeo.id, characters)).not.toEqual(actorDefault('emily', characters))
})
