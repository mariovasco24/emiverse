import { useEffect, useRef, useState } from 'react'
import { roomDoors, roomRoute, type Door, type RoomId } from '../domain/house'
export type RoomTransition = { from: RoomId; to: RoomId; side: Door['side']; duration: number }
type Options = {
  initialRoom: RoomId
  approach: (door: Door) => void
  beforeTransition: (transition: RoomTransition) => void
  enter: (door: Door) => void
}
/** Traversal is a sequence: walk to an exit, slide the camera, then continue the route. */
export function useHouseNavigation(options: Options) {
  const callbacks = useRef(options)
  callbacks.current = options
  const [room, setRoom] = useState(options.initialRoom)
  const [transition, setTransition] = useState<RoomTransition | null>(null)
  const [travelling, setTravelling] = useState(false)
  const route = useRef<RoomId[]>([])
  const exit = useRef<Door | null>(null)
  const complete = useRef<(() => void) | undefined>(undefined)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  function approachNext(from: RoomId) {
    const to = route.current[0]
    if (!to) {
      setTravelling(false)
      const action = complete.current
      complete.current = undefined
      action?.()
      return
    }
    const door = roomDoors(from).find((d) => d.to === to)
    if (!door) {
      cancel()
      return
    }
    exit.current = door
    callbacks.current.approach(door)
  }
  function navigate(to: RoomId, onComplete?: () => void) {
    if (transition) return
    route.current = roomRoute(room, to).slice(1)
    complete.current = onComplete
    setTravelling(route.current.length > 0)
    approachNext(room)
  }
  function arrivedAtExit() {
    const door = exit.current
    if (!door) return false
    exit.current = null
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650
    const next: RoomTransition = { from: door.from, to: door.to, side: door.side, duration }
    callbacks.current.beforeTransition(next)
    setTransition(next)
    setRoom(door.to)
    callbacks.current.enter(door)
    route.current.shift()
    timer.current = setTimeout(() => {
      setTransition(null)
      approachNext(door.to)
    }, duration)
    return true
  }
  function cancel() {
    // A committed camera transition finishes; only pending walking/routes are cancelled.
    route.current = []
    exit.current = null
    complete.current = undefined
    setTravelling(false)
  }
  return { room, transition, travelling, navigate, arrivedAtExit, cancel }
}
