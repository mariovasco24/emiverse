import { expect, it, vi, afterEach } from 'vitest'
import { clampPosition, initialSave, loadWorld } from './world'
afterEach(() => vi.unstubAllGlobals())
it('mantiene al personaje dentro de los límites jugables', () => {
  expect(clampPosition(-20, 200)).toEqual({ x: 5, y: 95 })
  expect(clampPosition(150, 0)).toEqual({ x: 95, y: 5 })
})
it('recupera personajes y recuerdos guardados', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ ...initialSave, collected: ['pet', 'gift'], fed: true }),
  })
  expect(loadWorld().collected).toEqual(['pet', 'gift'])
  expect(loadWorld().fed).toBe(true)
})
it.each(['null', '{', '{"characters":[]}', '{"characters":[{"name":"error"}]}'])(
  'tolera datos inválidos sin bloquear el juego: %s',
  (json) => {
    vi.stubGlobal('localStorage', { getItem: () => json })
    expect(loadWorld()).toEqual(initialSave)
  },
)
it('ignora un personaje seleccionado inexistente', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ ...initialSave, selected: 'missing' }),
  })
  expect(loadWorld()).toEqual(initialSave)
})
