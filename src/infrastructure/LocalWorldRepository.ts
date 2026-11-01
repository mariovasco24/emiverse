import type { WorldRepository } from '../application/WorldRepository'
import { parseWorldSave, type WorldSave } from '../domain/world'
const key = 'emiverse-world-v1'
export class LocalWorldRepository implements WorldRepository {
  constructor(
    private readonly storage: () => Pick<Storage, 'getItem' | 'setItem'> = () =>
      globalThis.localStorage,
  ) {}
  load(): WorldSave {
    try {
      return parseWorldSave(this.storage().getItem(key))
    } catch {
      return parseWorldSave(null)
    }
  }
  save(world: WorldSave) {
    this.storage().setItem(key, JSON.stringify(world))
  }
}
export const localWorldRepository = new LocalWorldRepository()
export const loadWorld = () => localWorldRepository.load()
