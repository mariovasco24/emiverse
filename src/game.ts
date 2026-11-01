export const worlds = [
  {
    name: 'Jardín de estrellas',
    subtitle: 'Todo gran viaje empieza con una pequeña estrella.',
    pairs: 6,
    icon: '✦',
    color: 'peach',
  },
  {
    name: 'Órbita de los sueños',
    subtitle: 'Un poquito más lejos, un poquito más de magia.',
    pairs: 8,
    icon: '☾',
    color: 'lavender',
  },
  {
    name: 'Galaxia infinita',
    subtitle: 'Tu memoria no tiene límites. ¡A explorar!',
    pairs: 10,
    icon: '✧',
    color: 'mint',
  },
] as const
export const symbols = ['🪐', '🚀', '🌙', '⭐', '🌍', '☄️', '🛸', '🌞', '👽', '🌈']
export type Card = { id: number; symbol: string }
export type Progress = { unlocked: number; stars: number[]; games: number; best: number }
export const emptyProgress: Progress = { unlocked: 0, stars: [0, 0, 0], games: 0, best: 0 }
export function makeDeck(pairs: number): Card[] {
  const deck = [...symbols.slice(0, pairs), ...symbols.slice(0, pairs)].map((symbol, id) => ({
    id,
    symbol,
  }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}
export function rating(moves: number, pairs: number) {
  return moves <= pairs + 3 ? 3 : moves <= pairs * 2 ? 2 : 1
}
export function readProgress(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem('emiverse-progress') || 'null')
    if (
      p &&
      Number.isInteger(p.unlocked) &&
      p.unlocked >= 0 &&
      p.unlocked <= 2 &&
      Array.isArray(p.stars) &&
      p.stars.length === 3 &&
      p.stars.every(
        (n: unknown) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 3,
      ) &&
      Number.isInteger(p.games) &&
      p.games >= 0 &&
      Number.isFinite(p.best) &&
      p.best >= 0
    )
      return p
  } catch {
    /* Storage may be unavailable in private browsing. */
  }
  return { ...emptyProgress, stars: [...emptyProgress.stars] }
}
export const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
