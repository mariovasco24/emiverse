import { constrainObject, type Point } from './layout'
import { clampPosition } from './world'

// Feet stay below the skirting board (49% of every room), including outdoors.
export const FLOOR_START = 51
export function isFloorPoint(point: Point) {
  return Number.isFinite(point.x) && Number.isFinite(point.y) && point.y >= FLOOR_START
}
export function constrainCharacterPosition(
  point: Point,
  item: { width: number; height: number },
  scene: { width: number; height: number },
): Point {
  const bounded = constrainObject(clampPosition(point.x, point.y), item, scene)
  return { ...bounded, y: Math.max(FLOOR_START, bounded.y) }
}
