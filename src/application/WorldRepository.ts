import type { WorldSave } from '../domain/world'
/** Persistence port: gameplay never depends on localStorage or a network SDK. */
export interface WorldRepository {
  load(): WorldSave
  save(world: WorldSave): void
}
