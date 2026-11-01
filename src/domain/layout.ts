export type Point = { x: number; y: number }
export type ObjectId = 'plant' | 'pet' | 'music' | 'art' | 'gift'
export type FurnitureId =
  | 'sofa'
  | 'wardrobe'
  | 'table'
  | 'picture'
  | 'hanging-plant'
  | 'house-plant'
  | 'bench'
export type ItemId = ObjectId | FurnitureId
export type ObjectPositions = Partial<Record<ItemId, Point>>
export const objects: {
  id: ObjectId
  label: string
  emoji: string
  x: number
  y: number
  garden: boolean
}[] = [
  { id: 'plant', label: 'Arcoflor', emoji: '🪴', x: 25, y: 62, garden: true },
  { id: 'pet', label: 'Nubi', emoji: '🐾', x: 72, y: 76, garden: false },
  { id: 'music', label: 'Música', emoji: '🎵', x: 33, y: 69, garden: false },
  { id: 'art', label: 'Pintar', emoji: '🎨', x: 75, y: 58, garden: true },
  { id: 'gift', label: 'Sorpresa', emoji: '🎁', x: 86, y: 67, garden: false },
]
export const furniture: { id: FurnitureId; label: string; garden: boolean }[] = [
  { id: 'sofa', label: 'Sofá', garden: false },
  { id: 'wardrobe', label: 'Armario', garden: false },
  { id: 'table', label: 'Mesita', garden: false },
  { id: 'picture', label: 'Cuadro', garden: false },
  { id: 'hanging-plant', label: 'Planta colgante', garden: false },
  { id: 'house-plant', label: 'Maceta grande', garden: false },
  { id: 'bench', label: 'Banco', garden: true },
]
export function isItemId(value: string): value is ItemId {
  return [...objects, ...furniture].some((item) => item.id === value)
}
export function readObjectPositions(input: unknown): ObjectPositions {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {}
  const result: ObjectPositions = {}
  for (const [id, value] of Object.entries(input)) {
    if (!isItemId(id) || !value || typeof value !== 'object') continue
    const { x, y } = value as Point
    if (Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 100 && y >= 0 && y <= 100)
      result[id] = { x, y }
  }
  return result
}
export function constrainObject(
  point: Point,
  size: { width: number; height: number },
  scene: { width: number; height: number },
): Point {
  if (!scene.width || !scene.height) return point
  const half = Math.min(50, ((size.width / 2 + 8) / scene.width) * 100)
  const top = Math.min(98, ((size.height + 8) / scene.height) * 100)
  return {
    x: Math.max(half, Math.min(100 - half, point.x)),
    y: Math.max(top, Math.min(Math.max(top, 100 - (8 / scene.height) * 100), point.y)),
  }
}
export function objectDefault(id: ObjectId, width: number, height: number): Point {
  const item = objects.find((item) => item.id === id)!
  if (width <= 520 && height > width) {
    if (id === 'music') return { x: 14, y: 51 }
    if (id === 'gift') return { x: item.x, y: 60 }
  }
  return { x: item.x, y: item.y }
}
export function furnitureLayout(id: FurnitureId, width: number, height: number) {
  const h = (height / Math.max(width, 1)) * 1200
  const portrait = h > 1200,
    s = portrait ? 1.55 : 1,
    wall = h * 0.49
  const layouts: Record<FurnitureId, { x: number; y: number; width: number; ratio: number }> = {
    sofa: {
      x: (portrait ? 30 : 72) + 145 * s,
      y: wall + 30 + 40 * s,
      width: 330 * s,
      ratio: 330 / 205,
    },
    wardrobe: {
      x: portrait ? 890 : 970,
      y: wall + 10,
      width: 204 * (portrait ? 1.1 : 1),
      ratio: 204 / 315,
    },
    table: {
      x: portrait ? 610 : 640,
      y: wall + 60 + 45 * s * 0.7,
      width: 180 * s * 0.7,
      ratio: 180 / 75,
    },
    picture: { x: portrait ? 230 : 205, y: wall * 0.39 + 75 * s, width: 130 * s, ratio: 130 / 150 },
    'hanging-plant': {
      x: portrait ? 960 : 1060,
      y: wall * 0.28 + 45 * s * 0.7,
      width: 140 * s * 0.7,
      ratio: 140 / 135,
    },
    'house-plant': {
      x: portrait ? 1120 : 1150,
      y: wall + 15 + 10 * s,
      width: 125 * s,
      ratio: 125 / 225,
    },
    bench: {
      x: (portrait ? 720 : 785) + 80 * s * 0.75,
      y: wall + 110 + 70 * s * 0.75,
      width: 210 * s * 0.75,
      ratio: 210 / 160,
    },
  }
  const layout = layouts[id]
  return {
    point: { x: layout.x / 12, y: (layout.y / h) * 100 },
    width: layout.width / 12,
    ratio: layout.ratio,
  }
}
