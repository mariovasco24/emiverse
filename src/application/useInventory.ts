import type { Dispatch, SetStateAction } from 'react'
import type { WorldSave } from '../domain/world'
import { moveCargo, originalCargoId, type CargoPlace, type ProductId } from '../domain/inventory'
import type { ObjectId, Point } from '../domain/layout'
export function useInventory(setSave: Dispatch<SetStateAction<WorldSave>>) {
  return {
    takeProduct(kind: ProductId) {
      const item = { id: crypto.randomUUID(), kind, place: 'bag' as const }
      setSave((s) => ({ ...s, inventory: [...s.inventory, item] }))
    },
    takeOriginal(kind: ObjectId) {
      const id = originalCargoId(kind)
      setSave((s) => ({
        ...s,
        inventory: s.inventory.some((i) => i.id === id)
          ? moveCargo(s.inventory, id, 'bag')
          : [...s.inventory, { id, kind, place: 'bag' }],
      }))
    },
    move(id: string, place: CargoPlace, point?: Point, beforeId?: string) {
      setSave((s) => ({ ...s, inventory: moveCargo(s.inventory, id, place, point, beforeId) }))
    },
  }
}
