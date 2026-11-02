import { useRef, useState } from 'react'
import { ShoppingBag, Snowflake } from 'lucide-react'
import { cargoLabel, type CargoItem, type CargoPlace } from '../../domain/inventory'
import { rooms, type RoomId } from '../../domain/house'
import { usePointerGesture } from '../../ui/usePointerGesture'
import WorldDialog from '../../ui/WorldDialog'
import GameButton from '../../ui/GameButton'
import CargoArt from './CargoArt'

function CargoToken({
  item,
  selected,
  onSelect,
  onMove,
}: {
  item: CargoItem
  selected: boolean
  onSelect: () => void
  onMove: (id: string, place: CargoPlace, before?: string) => void
}) {
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)
  const gesture = usePointerGesture({
    consumePointerClick: true,
    start() {},
    move(g) {
      setDrag({ x: g.clientX, y: g.clientY })
    },
    end(g) {
      if (g.moved) {
        const hit = document.elementFromPoint(g.clientX, g.clientY),
          zone = hit?.closest<HTMLElement>('[data-storage-zone]')
        if (zone)
          onMove(
            item.id,
            zone.dataset.storageZone as CargoPlace,
            hit?.closest<HTMLElement>('[data-cargo-id]')?.dataset.cargoId,
          )
      } else onSelect()
      setDrag(null)
    },
    cancel() {
      setDrag(null)
    },
  })
  return (
    <button
      {...gesture.handlers}
      className={`cargo-token ${drag ? 'cargo-dragging' : ''}`}
      data-cargo-id={item.id}
      aria-label={`Seleccionar ${cargoLabel(item.kind)}`}
      aria-pressed={selected}
      onClick={(e) => {
        if (e.detail === 0 || !gesture.consumeClick()) onSelect()
      }}
    >
      <CargoArt kind={item.kind} />
      <span>{cargoLabel(item.kind)}</span>
      {drag && (
        <span className="cargo-drag-ghost" style={{ left: drag.x, top: drag.y }}>
          <CargoArt kind={item.kind} />
        </span>
      )}
    </button>
  )
}
export default function StoragePanel({
  mode,
  items,
  room,
  onMove,
  onClose,
}: {
  mode: 'bag' | 'fridge'
  items: CargoItem[]
  room: RoomId
  onMove: (id: string, place: CargoPlace, before?: string) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const fridgeList = useRef<HTMLDivElement>(null),
    bagList = useRef<HTMLDivElement>(null)
  function browse(place: 'bag' | 'fridge') {
    const list = (place === 'bag' ? bagList : fridgeList).current
    if (!list) return
    const horizontal = list.scrollWidth > list.clientWidth + 1
    const offset = horizontal ? list.scrollLeft : list.scrollTop,
      total = horizontal ? list.scrollWidth : list.scrollHeight,
      size = horizontal ? list.clientWidth : list.clientHeight
    const next = offset + size >= total - 2 ? 0 : offset + size * 0.8
    list.scrollTo({ [horizontal ? 'left' : 'top']: next, behavior: 'smooth' })
  }
  const bag = items.filter((i) => i.place === 'bag'),
    fridge = items.filter((i) => i.place === 'fridge')
  const move = (id: string, place: CargoPlace, before?: string) => {
    onMove(id, place, before)
    setSelected(null)
  }
  const token = (item: CargoItem) => (
    <CargoToken
      key={item.id}
      item={item}
      selected={selected === item.id}
      onSelect={() => setSelected(item.id)}
      onMove={move}
    />
  )
  const selectedItem = items.find((i) => i.id === selected)
  return (
    <WorldDialog
      title={mode === 'fridge' ? 'Mi nevera' : 'Mi bolsa'}
      onClose={onClose}
      className={`storage-dialog storage-${mode}`}
    >
      <div className="storage-workbench">
        <p className="storage-instruction">
          {mode === 'fridge'
            ? 'Arrastra tus cosas entre la bolsa y los estantes.'
            : 'Lleva tus cosas a cualquier lugar de EmiVerse.'}
        </p>
        {mode === 'fridge' && (
          <section
            className="storage-fridge"
            aria-label="Interior de la nevera"
            data-storage-zone="fridge"
          >
            <div className="storage-heading">
              <Snowflake />
              <b>Estantes</b>
              <GameButton
                className="storage-scroll"
                onPress={() => browse('fridge')}
                aria-label="Ver siguientes objetos de la nevera"
              >
                Más
              </GameButton>
              <span>{fridge.length}</span>
            </div>
            <div className="storage-shelves" ref={fridgeList}>
              {fridge.map(token)}
              {!fridge.length && (
                <span className="storage-empty">Tu nevera está lista para llenarse</span>
              )}
            </div>
          </section>
        )}
        <section
          className="storage-bag-zone"
          aria-label="Contenido de la bolsa"
          data-storage-zone="bag"
        >
          <div className="storage-heading">
            <ShoppingBag />
            <b>Mi bolsa</b>
            <GameButton
              className="storage-scroll"
              onPress={() => browse('bag')}
              aria-label="Ver siguientes objetos de la bolsa"
            >
              Más
            </GameButton>
            <span>{bag.length}</span>
          </div>
          <div className="storage-bag-items" ref={bagList}>
            {bag.map(token)}
            {!bag.length && (
              <span className="storage-empty">Toca productos en la tienda para llevarlos</span>
            )}
          </div>
        </section>
        <div className="storage-actions">
          {mode === 'fridge' && (
            <GameButton
              disabled={!selectedItem}
              onPress={() =>
                selected && move(selected, selectedItem?.place === 'fridge' ? 'bag' : 'fridge')
              }
            >
              {selectedItem?.place === 'fridge' ? 'A la bolsa' : 'A la nevera'}
            </GameButton>
          )}
          <GameButton disabled={!selectedItem} onPress={() => selected && move(selected, room)}>
            Dejar en {rooms.find((r) => r.id === room)!.label}
          </GameButton>
        </div>
      </div>
    </WorldDialog>
  )
}
