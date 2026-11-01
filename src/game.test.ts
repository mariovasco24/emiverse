import { describe, expect, it, vi, afterEach } from 'vitest'
import { makeDeck, rating, readProgress, emptyProgress, clock } from './game'
afterEach(() => vi.unstubAllGlobals())
describe('Memoria cósmica', () => {
  it.each([6, 8, 10])('crea exactamente %i parejas con identificadores únicos', pairs => {
    const deck = makeDeck(pairs)
    expect(deck).toHaveLength(pairs * 2)
    expect(new Set(deck.map(c => c.id)).size).toBe(pairs * 2)
    expect(new Set(deck.map(c => c.symbol)).size).toBe(pairs)
    for (const symbol of new Set(deck.map(c => c.symbol))) expect(deck.filter(c => c.symbol === symbol)).toHaveLength(2)
  })
  it('otorga estrellas según movimientos', () => {
    expect(rating(9, 6)).toBe(3)
    expect(rating(10, 6)).toBe(2)
    expect(rating(12, 6)).toBe(2)
    expect(rating(13, 6)).toBe(1)
  })
  it('recupera una partida guardada válida', () => {
    const saved = { unlocked: 1, stars: [3, 0, 0], games: 1, best: 1000 }
    vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(saved) })
    expect(readProgress()).toEqual(saved)
  })
  it.each(['{broken', '{"unlocked":99}', '{"unlocked":0,"stars":[9,0,0],"games":0,"best":0}'])('ignora datos corruptos: %s', saved => {
    vi.stubGlobal('localStorage', { getItem: () => saved })
    expect(readProgress()).toEqual(emptyProgress)
  })
  it('funciona con almacenamiento bloqueado', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('blocked') } })
    expect(readProgress()).toEqual(emptyProgress)
  })
  it('muestra el tiempo transcurrido', () => { expect(clock(65)).toBe('01:05') })
})
