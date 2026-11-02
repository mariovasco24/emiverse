import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { constrainObject, type Point } from '../domain/layout'
import { usePointerGesture } from './usePointerGesture'
export type DraggableProps<Id extends string> = {
  id: Id
  label: string
  point: Point
  sceneRef: RefObject<HTMLDivElement | null>
  selected: boolean
  disabled: boolean
  draggable?: boolean
  constrainPoint?: typeof constrainObject
  onActivate?: (id: Id) => void
  kind?: 'object' | 'character'
  elevateSelection?: boolean
  depthOffset?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
  onSelect: (id: Id | null) => void
  onDrop: (id: Id, point: Point) => void
  /** Keep the last valid point on interruption when supplied; other entities revert. */
  onCancel?: (id: Id, point: Point) => void
  onBusy: (busy: boolean) => void
}
export default function DraggableEntity<Id extends string>({
  kind = 'object',
  elevateSelection = true,
  id,
  label,
  point,
  sceneRef,
  selected,
  disabled,
  draggable = true,
  constrainPoint = constrainObject,
  onActivate,
  depthOffset = 10,
  className = '',
  style,
  children,
  onSelect,
  onDrop,
  onCancel,
  onBusy,
}: DraggableProps<Id>) {
  const ref = useRef<HTMLButtonElement>(null)
  const [geometry, setGeometry] = useState({
    item: { width: 0, height: 0 },
    scene: { width: 0, height: 0 },
  })
  const [preview, setPreview] = useState<Point | null>(null)
  const lastPreview = useRef<Point | null>(null)
  const [dragging, setDragging] = useState(false)
  const origin = useRef(point)
  useEffect(() => {
    const item = ref.current,
      scene = sceneRef.current
    if (!item || !scene) return
    const observer = new ResizeObserver(() => {
      setGeometry({
        item: { width: item.offsetWidth, height: item.offsetHeight },
        scene: { width: scene.clientWidth, height: scene.clientHeight },
      })
      gesture.cancel()
    })
    observer.observe(item)
    observer.observe(scene)
    return () => observer.disconnect()
  }, [sceneRef, onBusy])
  const displayed = constrainPoint(preview || point, geometry.item, geometry.scene)
  const movedPoint = (dx: number, dy: number) =>
    constrainPoint(
      {
        x: origin.current.x + (dx / geometry.scene.width) * 100,
        y: origin.current.y + (dy / geometry.scene.height) * 100,
      },
      geometry.item,
      geometry.scene,
    )
  const gesture = usePointerGesture(
    {
      consumePointerClick: true,
      start() {
        if (!draggable) return
        lastPreview.current = null
        origin.current = displayed
        onSelect(id)
        onBusy(true)
      },
      move(g) {
        if (!draggable) return
        const next = movedPoint(g.dx, g.dy)
        lastPreview.current = next
        setDragging(true)
        setPreview(next)
      },
      end(g) {
        if (draggable && g.moved) onDrop(id, movedPoint(g.dx, g.dy))
        if (!draggable && !g.moved) onActivate?.(id)
        lastPreview.current = null
        setPreview(null)
        setDragging(false)
        onBusy(false)
      },
      cancel() {
        const last = lastPreview.current
        lastPreview.current = null
        if (draggable && last) onCancel?.(id, last)
        setPreview(null)
        setDragging(false)
        onBusy(false)
      },
    },
    disabled,
  )
  useEffect(() => gesture.cancel(), [draggable])
  return (
    <button
      ref={ref}
      disabled={disabled}
      {...gesture.handlers}
      className={`scene-object movable-object ${className} ${selected ? 'object-selected' : ''} ${dragging ? 'object-dragging' : ''}`}
      data-item={kind === 'object' ? id : undefined}
      data-actor={kind === 'character' ? id : undefined}
      data-x={displayed.x.toFixed(2)}
      data-y={displayed.y.toFixed(2)}
      data-draggable={draggable}
      style={{
        ...style,
        left: `${displayed.x}%`,
        top: `${displayed.y}%`,
        zIndex: dragging
          ? 180
          : selected && elevateSelection
            ? 170
            : Math.round(displayed.y) + depthOffset,
      }}
      aria-label={`Seleccionar ${label}`}
      aria-pressed={selected}
      onClick={() => {
        if (!disabled) {
          if (draggable) onSelect(id)
          else onActivate?.(id)
        }
      }}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 5 : 2
        const delta: Record<string, Point> = {
          ArrowLeft: { x: -step, y: 0 },
          ArrowRight: { x: step, y: 0 },
          ArrowUp: { x: 0, y: -step },
          ArrowDown: { x: 0, y: step },
        }
        if (e.key === 'Escape') {
          e.stopPropagation()
          onSelect(null)
          return
        }
        if (draggable && selected && delta[e.key]) {
          e.preventDefault()
          e.stopPropagation()
          onDrop(
            id,
            constrainPoint(
              { x: displayed.x + delta[e.key].x, y: displayed.y + delta[e.key].y },
              geometry.item,
              geometry.scene,
            ),
          )
        }
      }}
    >
      {children}
    </button>
  )
}
