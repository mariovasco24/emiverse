import { isRoom, type RoomId } from './house'
import { readCastPositions, type CastPositions } from './cast'
import { readObjectPositions, type ObjectPositions } from './layout'
import { initialCloset, readCloset, type ClosetSlots } from './wardrobe'
import { readInventory, type CargoItem } from './inventory'
export const skinColors = ['#f5d0ad', '#dfab83', '#b97850', '#805239']
export const shirtColors = ['#f18c9e', '#a9a0e9', '#78bfad', '#edb958', '#7eaee1', '#e47560']
export type Character = {
  id: string
  name: string
  skin: string
  shirt: string
  hair: 'short' | 'long' | 'buns'
  accessory: 'none' | 'bow' | 'crown'
}
export type WorldSave = {
  characters: Character[]
  selected: string
  collected: string[]
  watered: boolean
  fed: boolean
  objectPositions: ObjectPositions
  currentRoom: RoomId
  castPositions: CastPositions
  closetSlots: ClosetSlots
  inventory: CargoItem[]
}
export const initialSave: WorldSave = {
  characters: [
    {
      id: 'emily',
      name: 'Emily',
      skin: skinColors[0],
      shirt: shirtColors[0],
      hair: 'buns',
      accessory: 'bow',
    },
  ],
  selected: 'emily',
  collected: [],
  watered: false,
  fed: false,
  objectPositions: {},
  closetSlots: initialCloset,
  inventory: [],
  currentRoom: 'home',
  castPositions: { home: {}, garden: {}, kitchen: {}, bedroom: {}, shop: {} },
}
export function parseWorldSave(raw: string | null): WorldSave {
  try {
    const data = JSON.parse(raw || 'null')
    if (
      !data ||
      !Array.isArray(data.characters) ||
      data.characters.length < 1 ||
      data.characters.length > 5
    )
      return structuredClone(initialSave)
    const valid = data.characters.every(
      (c: Character) =>
        typeof c.id === 'string' &&
        typeof c.name === 'string' &&
        c.name.length > 0 &&
        c.name.length <= 16 &&
        skinColors.includes(c.skin) &&
        shirtColors.includes(c.shirt) &&
        ['short', 'long', 'buns'].includes(c.hair) &&
        ['none', 'bow', 'crown'].includes(c.accessory),
    )
    if (
      !valid ||
      new Set(data.characters.map((c: Character) => c.id)).size !== data.characters.length ||
      !data.characters.some((c: Character) => c.id === data.selected) ||
      !Array.isArray(data.collected) ||
      !data.collected.every(
        (id: unknown) =>
          typeof id === 'string' && ['plant', 'pet', 'music', 'art', 'gift'].includes(id),
      ) ||
      typeof data.watered !== 'boolean' ||
      typeof data.fed !== 'boolean'
    )
      return structuredClone(initialSave)
    return {
      ...data,
      objectPositions: readObjectPositions(data.objectPositions),
      currentRoom: isRoom(data.currentRoom) ? data.currentRoom : 'home',
      castPositions: readCastPositions(data.castPositions, data.characters),
      closetSlots: readCloset(data.closetSlots),
      inventory: readInventory(data.inventory),
      collected: [...new Set(data.collected)],
    }
  } catch {
    return structuredClone(initialSave)
  }
}
export function clampPosition(x: number, y: number) {
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
}
