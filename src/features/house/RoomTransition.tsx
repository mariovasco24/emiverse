import { useLayoutEffect, useRef } from 'react'
import type { RoomTransition as Transition } from '../../application/useHouseNavigation'
/** Clone the owned SVG scene only; snapshots have no handlers, focus targets or live actor IDs. */
export function captureRoom(scene: HTMLElement | null): HTMLElement | null {
  if (!scene) return null
  const snapshot = scene.cloneNode(true) as HTMLElement
  snapshot.removeAttribute('id')
  snapshot.removeAttribute('data-room')
  snapshot.querySelectorAll<HTMLElement>('[data-actor],[data-item]').forEach((node) => {
    node.removeAttribute('data-actor')
    node.removeAttribute('data-item')
    node.classList.remove('actor-active')
  })
  snapshot.querySelectorAll('button').forEach((button) => {
    button.disabled = true
    button.tabIndex = -1
  })
  const ids = new Map<string, string>()
  snapshot.querySelectorAll('[id]').forEach((node) => {
    const id = node.id
    ids.set(id, `snapshot-${id}`)
    node.id = `snapshot-${id}`
  })
  snapshot.querySelectorAll('*').forEach((node) => {
    for (const attr of Array.from(node.attributes)) {
      const value = attr.value.replace(/url\(#([^)]*)\)/g, (match, id: string) =>
        ids.has(id) ? `url(#${ids.get(id)})` : match,
      )
      if (value !== attr.value) node.setAttribute(attr.name, value)
    }
  })
  return snapshot
}
export default function RoomTransition({
  snapshot,
  transition,
}: {
  snapshot: HTMLElement
  transition: Transition
}) {
  const host = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    host.current?.replaceChildren(snapshot)
    return () => host.current?.replaceChildren()
  }, [snapshot])
  return (
    <div
      className={`room-snapshot room-leave-${transition.side}`}
      ref={host}
      aria-hidden="true"
      inert
      style={{ animationDuration: `${transition.duration}ms` }}
    />
  )
}
