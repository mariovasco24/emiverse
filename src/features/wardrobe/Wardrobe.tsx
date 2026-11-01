import { useRef, useState } from 'react'
import { garments, swapSlots, type ClosetSlots, type GarmentId } from '../../domain/wardrobe'
import GameButton from '../../ui/GameButton'
import { usePointerGesture } from '../../ui/usePointerGesture'
type Props = {
  slots: ClosetSlots
  crownUnlocked: boolean
  name: string
  onChange: (slots: ClosetSlots) => void
  onWear: (id: GarmentId) => void
}
export default function Wardrobe({ slots, crownUnlocked, name, onChange, onWear }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const from = useRef(0)
  const touchHandled = useRef(false)
  const [dragPoint, setDragPoint] = useState<{ x: number; y: number } | null>(null)
  const chosen = selected === null ? null : slots[selected]
  const locked = chosen === 'crown' && !crownUnlocked
  function move(to: number) {
    if (selected !== null) onChange(swapSlots(slots, selected, to))
    setSelected(null)
  }
  function tapSlot(index: number) {
    if (selected !== null && selected !== index) move(index)
    else setSelected(selected === index ? null : index)
  }
  const gesture = usePointerGesture({
    start() {
      touchHandled.current = false
    },
    move(g) {
      if (!slots[from.current]) return
      setDragging(from.current)
      setDragPoint({ x: g.clientX, y: g.clientY })
    },
    end(g) {
      if (g.moved && slots[from.current]) {
        const target = document
          .elementFromPoint(g.clientX, g.clientY)
          ?.closest<HTMLElement>('[data-closet-slot]')
        if (target) {
          onChange(swapSlots(slots, from.current, Number(target.dataset.closetSlot)))
          setSelected(null)
        }
      }
      if (!g.moved && g.pointerType === 'touch') {
        touchHandled.current = true
        tapSlot(from.current)
      }
      setDragging(null)
      setDragPoint(null)
    },
    cancel() {
      setDragging(null)
      setDragPoint(null)
    },
  })
  return (
    <div className="closet">
      <p className="closet-instruction">
        Arrastra una prenda a otro espacio. También puedes tocar una prenda y después el espacio de
        destino.
      </p>
      <div className="closet-grid">
        {slots.map((id, index) => {
          const garment = garments.find((g) => g.id === id)
          return (
            <button
              key={index}
              data-closet-slot={index}
              className={`closet-slot ${selected === index ? 'closet-selected' : ''} ${dragging === index ? 'closet-dragging' : ''}`}
              aria-label={`Espacio ${index + 1}: ${garment?.label || 'vacío'}`}
              aria-pressed={selected === index}
              {...gesture.handlers}
              onPointerDown={(e) => {
                if (e.isPrimary && e.button === 0) from.current = index
                gesture.handlers.onPointerDown(e)
              }}
              onClick={(e) => {
                if (e.detail !== 0 && (gesture.consumeClick() || touchHandled.current)) return
                tapSlot(index)
              }}
            >
              {garment ? (
                <>
                  <GarmentArt id={garment.id} />
                  <span>
                    {garment.label}
                    {id === 'crown' && !crownUnlocked ? ' 🔒' : ''}
                  </span>
                </>
              ) : (
                <span className="empty-slot">
                  ✧<small>Espacio libre</small>
                </span>
              )}
            </button>
          )
        })}
      </div>
      {dragPoint && slots[from.current] && (
        <div className="closet-floating" style={{ left: dragPoint.x, top: dragPoint.y }}>
          <GarmentArt id={slots[from.current]!} />
        </div>
      )}
      <div className="closet-actions">
        <p role="status">
          {chosen
            ? `${garments.find((g) => g.id === chosen)!.label} seleccionada`
            : 'Selecciona una prenda para vestir a tu personaje.'}
        </p>
        {chosen && (
          <GameButton
            className="world-primary wide"
            disabled={locked}
            onPress={() => onWear(chosen)}
          >
            {locked ? 'Encuentra la sorpresa para usar la corona' : `Poner a ${name}`}
          </GameButton>
        )}
      </div>
    </div>
  )
}
function GarmentArt({ id }: { id: GarmentId }) {
  const garment = garments.find((g) => g.id === id)!
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g stroke="#926979" strokeWidth="3" strokeLinejoin="round">
        {garment.kind === 'shirt' ? (
          <>
            <path
              d="m32 18-23 20 14 19 10-8-5 40h45l-5-40 10 8 14-19-23-20-17 9Z"
              fill={garment.color}
            />
            <path d="M32 18q19 29 37 0" fill="#fff1cd" />
            <path
              d="m51 51 4 9 10 1-8 7 2 10-8-5-9 5 2-10-8-7 11-1Z"
              fill="#fff1a2"
              strokeWidth="2"
            />
          </>
        ) : id === 'bow' ? (
          <>
            <path d="M49 48Q8 2 8 38q-5 50 40 18 45 32 44-18 1-36-43 10Z" fill={garment.color} />
            <circle cx="50" cy="51" r="10" fill="#ffdfa2" />
          </>
        ) : (
          <path d="m20 76-8-46 23 15 15-25 15 25 23-15-8 46Z" fill={garment.color} />
        )}
      </g>
    </svg>
  )
}
