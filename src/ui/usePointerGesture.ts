import { suppressCompatibilityClick } from './suppressCompatibilityClick'
import { useEffect, useRef, type PointerEvent } from 'react'
export type Gesture = {
  pointerType: string
  dx: number
  dy: number
  clientX: number
  clientY: number
  moved: boolean
}
type Callbacks = {
  start: () => void
  move: (gesture: Gesture) => void
  end: (gesture: Gesture) => void
  cancel: () => void
}
/** Shared input adapter for mouse, touch and pen. No game or persistence rules here. */
export function usePointerGesture(callbacks: Callbacks, disabled = false) {
  const current = useRef(callbacks)
  current.current = callbacks
  const active = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  function cancel() {
    if (!active.current) return
    active.current = null
    suppressClick.current = true
    suppressCompatibilityClick()
    current.current.cancel()
  }
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) cancel()
    }
    window.addEventListener('blur', cancel)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      window.removeEventListener('blur', cancel)
      document.removeEventListener('visibilitychange', visibility)
      cancel()
    }
  }, [])
  useEffect(() => {
    if (disabled) cancel()
  }, [disabled])
  function gesture(e: PointerEvent<HTMLElement>): Gesture | null {
    const a = active.current
    if (!a || a.id !== e.pointerId) return null
    const dx = e.clientX - a.x,
      dy = e.clientY - a.y
    a.moved ||= Math.hypot(dx, dy) >= 7
    return {
      pointerType: e.pointerType,
      dx,
      dy,
      clientX: e.clientX,
      clientY: e.clientY,
      moved: a.moved,
    }
  }
  return {
    cancel,
    consumeClick() {
      const value = suppressClick.current
      suppressClick.current = false
      return value
    },
    handlers: {
      onPointerDown(e: PointerEvent<HTMLElement>) {
        if (disabled || active.current || !e.isPrimary || e.button !== 0) return
        e.stopPropagation()
        suppressClick.current = false
        active.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }
        e.currentTarget.setPointerCapture(e.pointerId)
        e.currentTarget.focus({ preventScroll: true })
        current.current.start()
      },
      onPointerMove(e: PointerEvent<HTMLElement>) {
        const g = gesture(e)
        if (g?.moved) {
          e.stopPropagation()
          current.current.move(g)
        }
      },
      onPointerUp(e: PointerEvent<HTMLElement>) {
        const g = gesture(e)
        if (!g) return
        e.stopPropagation()
        active.current = null
        suppressClick.current = g.moved
        if (g.moved) suppressCompatibilityClick()
        current.current.end(g)
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId)
      },
      onPointerCancel: cancel,
      onLostPointerCapture: cancel,
    },
  }
}
