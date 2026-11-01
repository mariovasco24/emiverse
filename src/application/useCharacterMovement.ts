import { useEffect, useRef, useState } from 'react'
import type { Point } from '../domain/layout'
export function useCharacterMovement(blocked: boolean, constrain: (x: number, y: number) => Point) {
  const [position, setPosition] = useState({ x: 48, y: 76 })
  const [walking, setWalking] = useState(false)
  const positionRef = useRef(position)
  positionRef.current = position
  const keys = useRef(new Set<string>())
  const direction = useRef({ x: 0, y: 0 })
  const destination = useRef<Point | null>(null)
  const constrainRef = useRef(constrain)
  constrainRef.current = constrain
  useEffect(() => {
    if (blocked) {
      keys.current.clear()
      direction.current = { x: 0, y: 0 }
      destination.current = null
      setWalking(false)
      return
    }
    const keydown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault()
        keys.current.add(e.key)
        destination.current = null
      }
    }
    const keyup = (e: KeyboardEvent) => keys.current.delete(e.key)
    const clear = () => {
      keys.current.clear()
      direction.current = { x: 0, y: 0 }
      destination.current = null
      setWalking(false)
    }
    window.addEventListener('keydown', keydown)
    window.addEventListener('keyup', keyup)
    window.addEventListener('blur', clear)
    const visibility = () => {
      if (document.hidden) clear()
    }
    document.addEventListener('visibilitychange', visibility)
    let frame: number
    let last = 0
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04)
      last = now
      const k = keys.current
      let dx =
        direction.current.x +
        (k.has('ArrowRight') || k.has('d') ? 1 : 0) -
        (k.has('ArrowLeft') || k.has('a') ? 1 : 0)
      let dy =
        direction.current.y +
        (k.has('ArrowDown') || k.has('s') ? 1 : 0) -
        (k.has('ArrowUp') || k.has('w') ? 1 : 0)
      if (dx || dy) destination.current = null
      const p = positionRef.current
      if (destination.current && !dx && !dy) {
        const tx = destination.current.x - p.x,
          ty = destination.current.y - p.y
        if (Math.hypot(tx, ty) < 1) destination.current = null
        else {
          dx = tx
          dy = ty
        }
      }
      const length = Math.hypot(dx, dy)
      setWalking(length > 0)
      if (length) {
        const next = constrainRef.current(
          p.x + (dx / length) * dt * 22,
          p.y + (dy / length) * dt * 22,
        )
        positionRef.current = next
        setPosition(next)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('keyup', keyup)
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', visibility)
      clear()
    }
  }, [blocked])

  return { position, setPosition, walking, direction, destination }
}
