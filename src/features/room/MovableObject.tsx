import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { constrainObject, type ItemId, type Point } from '../../domain/layout'
import { usePointerGesture } from '../../ui/usePointerGesture'
type Props = {
  id: ItemId
  label: string
  point: Point
  sceneRef: RefObject<HTMLDivElement | null>
  selected: boolean
  disabled: boolean
  depthOffset?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
  onSelect: (id: ItemId | null) => void
  onDrop: (id: ItemId, point: Point) => void
  onBusy: (busy: boolean) => void
}
export default function MovableObject({
  id,
  label,
  point,
  sceneRef,
  selected,
  disabled,
  depthOffset = 10,
  className = '',
  style,
  children,
  onSelect,
  onDrop,
  onBusy,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const [geometry, setGeometry] = useState({
    item: { width: 0, height: 0 },
    scene: { width: 0, height: 0 },
  })
  const [preview, setPreview] = useState<Point | null>(null)
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
  const displayed = constrainObject(preview || point, geometry.item, geometry.scene)
  const movedPoint = (dx: number, dy: number) =>
    constrainObject(
      {
        x: origin.current.x + (dx / geometry.scene.width) * 100,
        y: origin.current.y + (dy / geometry.scene.height) * 100,
      },
      geometry.item,
      geometry.scene,
    )
  const gesture = usePointerGesture(
    {
      start() {
        origin.current = displayed
        onSelect(id)
        onBusy(true)
      },
      move(g) {
        setDragging(true)
        setPreview(movedPoint(g.dx, g.dy))
      },
      end(g) {
        if (g.moved) onDrop(id, movedPoint(g.dx, g.dy))
        setPreview(null)
        setDragging(false)
        onBusy(false)
      },
      cancel() {
        setPreview(null)
        setDragging(false)
        onBusy(false)
      },
    },
    disabled,
  )
  return (
    <button
      ref={ref}
      {...gesture.handlers}
      className={`scene-object movable-object ${className} ${selected ? 'object-selected' : ''} ${dragging ? 'object-dragging' : ''}`}
      data-item={id}
      data-x={displayed.x.toFixed(2)}
      data-y={displayed.y.toFixed(2)}
      style={{
        ...style,
        left: `${displayed.x}%`,
        top: `${displayed.y}%`,
        zIndex: dragging ? 180 : selected ? 170 : Math.round(displayed.y) + depthOffset,
      }}
      aria-label={`Seleccionar ${label}`}
      aria-pressed={selected}
      onClick={() => {
        if (!disabled) onSelect(id)
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
        if (selected && delta[e.key]) {
          e.preventDefault()
          e.stopPropagation()
          onDrop(
            id,
            constrainObject(
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
