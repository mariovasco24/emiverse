import { useEffect, useRef, useState } from 'react'
import type { Point } from '../domain/layout'
type MovementOptions = {
  blocked: boolean
  identity: string
  constrain: (x: number, y: number) => Point
  onSettled: (point: Point) => void
  initialPoint: Point
}
export function useCharacterMovement({
  blocked,
  identity,
  constrain,
  onSettled,
  initialPoint,
}: MovementOptions) {
  const [position, setPosition] = useState(initialPoint)
  const [walking, setWalking] = useState(false)
  const positionRef = useRef(position)
  positionRef.current = position
  const keys = useRef(new Set<string>())
  const destination = useRef<Point | null>(null)
  const settledRef = useRef(onSettled)
  settledRef.current = onSettled
  const constrainRef = useRef(constrain)
  constrainRef.current = constrain
  useEffect(() => {
    const current = positionRef.current
    const bounded = constrainRef.current(current.x, current.y)
    if (bounded.x !== current.x || bounded.y !== current.y) {
      positionRef.current = bounded
      setPosition(bounded)
    }
    if (destination.current)
      destination.current = constrainRef.current(destination.current.x, destination.current.y)
  })
  useEffect(() => {
    if (blocked) {
      keys.current.clear()
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
    const keyup = (e: KeyboardEvent) => {
      if (keys.current.delete(e.key) && !keys.current.size) settledRef.current(positionRef.current)
    }
    const clear = () => {
      keys.current.clear()
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
        (k.has('ArrowRight') || k.has('d') ? 1 : 0) - (k.has('ArrowLeft') || k.has('a') ? 1 : 0)
      let dy = (k.has('ArrowDown') || k.has('s') ? 1 : 0) - (k.has('ArrowUp') || k.has('w') ? 1 : 0)
      if (dx || dy) destination.current = null
      const p = positionRef.current
      if (destination.current && !dx && !dy) {
        const tx = destination.current.x - p.x,
          ty = destination.current.y - p.y
        if (Math.hypot(tx, ty) < 1) {
          const arrived = constrainRef.current(destination.current.x, destination.current.y)
          destination.current = null
          positionRef.current = arrived
          setPosition(arrived)
          settledRef.current(arrived)
        } else {
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
  }, [blocked, identity])

  return { position, setPosition, walking, destination }
}
