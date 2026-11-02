import { isRoom, type RoomId } from './house'
import { objects, type ObjectId, type Point } from './layout'
export const products = [
  { id: 'apple', label: 'Manzana' },
  { id: 'banana', label: 'Plátano' },
  { id: 'carrot', label: 'Zanahoria' },
  { id: 'milk', label: 'Leche' },
  { id: 'juice', label: 'Zumo' },
  { id: 'cheese', label: 'Queso' },
  { id: 'bread', label: 'Pan' },
  { id: 'cupcake', label: 'Pastelito' },
  { id: 'flower', label: 'Flor' },
  { id: 'toy', label: 'Osito de juguete' },
] as const
export type ProductId = (typeof products)[number]['id']
export type CargoKind = ProductId | ObjectId
export type CargoPlace = 'bag' | 'fridge' | RoomId
export type CargoItem = { id: string; kind: CargoKind; place: CargoPlace; point?: Point }
export function cargoLabel(kind: CargoKind) {
  return [...products, ...objects].find((p) => p.id === kind)!.label
}
export function isOriginalKind(kind: string): kind is ObjectId {
  return objects.some((o) => o.id === kind)
}
export function originalCargoId(kind: ObjectId) {
  return `world-${kind}`
}
export function moveCargo(
  items: CargoItem[],
  id: string,
  place: CargoPlace,
  point?: Point,
  beforeId?: string,
): CargoItem[] {
  const item = items.find((i) => i.id === id)
  if (!item || beforeId === id) return items
  const moved: CargoItem = {
    id: item.id,
    kind: item.kind,
    place,
    ...(isRoom(place) ? { point: point || { x: 55, y: 86 } } : {}),
  }
  const rest = items.filter((i) => i.id !== id),
    at = beforeId ? rest.findIndex((i) => i.id === beforeId && i.place === place) : -1
  if (at >= 0) rest.splice(at, 0, moved)
  else rest.push(moved)
  return rest
}
export function readInventory(raw: unknown): CargoItem[] {
  if (!Array.isArray(raw)) return []
  const seen = new Set<string>(),
    result: CargoItem[] = []
  for (const value of raw) {
    if (!value || typeof value !== 'object') continue
    const { id, kind, place, point } = value
    if (
      typeof id !== 'string' ||
      !id ||
      id.length > 100 ||
      seen.has(id) ||
      ![...products, ...objects].some((p) => p.id === kind)
    )
      continue
    if (isOriginalKind(kind) ? id !== originalCargoId(kind) : id.startsWith('world-')) continue
    if (place !== 'bag' && place !== 'fridge' && !isRoom(place)) continue
    const validPoint =
      point &&
      Number.isFinite(point.x) &&
      Number.isFinite(point.y) &&
      point.x >= 0 &&
      point.x <= 100 &&
      point.y >= 0 &&
      point.y <= 100
    result.push({
      id,
      kind,
      place,
      ...(isRoom(place)
        ? { point: validPoint ? { x: point.x, y: point.y } : { x: 55, y: 86 } }
        : {}),
    })
    seen.add(id)
  }
  return result
}
