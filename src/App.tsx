import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  Maximize,
  Move,
  Check,
  Map,
  Gamepad2,
  Palette,
  Plus,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  X,
  ShoppingBag,
} from 'lucide-react'
import Avatar from './Character'
import Scenery from './Scenery'
import MemoryGame from './MemoryGame'
import { clampPosition, shirtColors, skinColors, type Character } from './domain/world'
import {
  objects,
  furniture,
  furnitureLayout,
  objectDefault,
  type FurnitureId,
  type ItemId,
  type ObjectId,
  type Point,
} from './domain/layout'
import { garments, type GarmentId } from './domain/wardrobe'
import { useAmbientMusic } from './application/useAmbientMusic'
import { useWorld } from './application/useWorld'
import { useInventory } from './application/useInventory'
import { originalCargoId, isOriginalKind, cargoLabel, type CargoPlace } from './domain/inventory'
import StoragePanel from './features/inventory/StoragePanel'
import ShopStock from './features/inventory/ShopStock'
import CargoArt from './features/inventory/CargoArt'
import { useCharacterMovement } from './application/useCharacterMovement'
import { localWorldRepository } from './infrastructure/LocalWorldRepository'
import MovableCharacter from './features/room/MovableCharacter'
import { actorDefault, guestLeo } from './domain/cast'
import { FLOOR_START, isFloorPoint } from './domain/movement'
import { rooms, roomDoors, type RoomId } from './domain/house'
import { useHouseNavigation } from './application/useHouseNavigation'
import { HouseNavigation, RoomDoors } from './features/house/HouseNavigation'
import RoomTransition, { captureRoom } from './features/house/RoomTransition'
import GameButton from './ui/GameButton'
import WorldDialog from './ui/WorldDialog'
import MovableObject from './features/room/MovableObject'
import FurnitureArt from './features/room/FurnitureArt'
import CharacterEditor from './features/wardrobe/CharacterEditor'
import Wardrobe from './features/wardrobe/Wardrobe'
import { Pet, Plant } from './features/room/ObjectArt'
import './world.css'
import './features/inventory/inventory.css'
export default function App() {
  const { save, setSave, storageBlocked } = useWorld(localWorldRepository)
  const inventory = useInventory(setSave)
  const [activeActorId, setActiveActorId] = useState(save.selected)
  const [snapshot, setSnapshot] = useState<HTMLElement | null>(null)
  const navigation = useHouseNavigation({
    initialRoom: save.currentRoom,
    approach: (door) => {
      setHint(false)
      clearSelection()
      destination.current = constrainCharacter(door.approach.x, door.approach.y)
    },
    beforeTransition: (transition) => {
      if (transition.duration) setSnapshot(captureRoom(sceneRef.current))
    },
    enter: (door) => {
      const entry = constrainCharacter(door.entry.x, door.entry.y)
      setPosition(entry)
      destination.current = null
      clearSelection()
      setSave((s) => ({
        ...s,
        currentRoom: door.to,
        castPositions: {
          ...s.castPositions,
          [door.to]: { ...s.castPositions[door.to], [activeActorId]: entry },
        },
      }))
    },
  })
  const room = navigation.room
  const garden = room === 'garden'
  const cast = [...save.characters, guestLeo]
  const [editor, setEditor] = useState(false)
  const [draft, setDraft] = useState<Character | null>(null)
  const [help, setHelp] = useState(false)
  const [memory, setMemory] = useState(false)
  const [toast, setToast] = useState('')
  const [sound, setSound] = useState(false)
  const [music, setMusic] = useState(false)
  const [painting, setPainting] = useState(0)
  const [mapOpen, setMapOpen] = useState(false)
  const [hint, setHint] = useState(true)
  const [sceneHeight, setSceneHeight] = useState(760)
  const [sceneSize, setSceneSize] = useState({ width: 1200, height: 760 })
  const [playerMinY, setPlayerMinY] = useState(5)
  const [selectedObject, setSelectedObject] = useState<ItemId | null>(null)
  const [arranging, setArranging] = useState(false)
  const [openFurniture, setOpenFurniture] = useState<Partial<Record<FurnitureId, boolean>>>({})
  const [manipulating, setManipulating] = useState(false)
  const [closetOpen, setClosetOpen] = useState(false)
  const [storageView, setStorageView] = useState<'bag' | 'fridge' | null>(null)
  const [selectedCargo, setSelectedCargo] = useState<string | null>(null)
  const character = save.characters.find((c) => c.id === save.selected)!
  const modalBlocked =
    editor || help || memory || mapOpen || closetOpen || !!storageView || !!navigation.transition
  const blocked = modalBlocked || manipulating
  const constrainCharacter = (x: number, y: number) => {
    const point = clampPosition(x, y)
    return {
      x: Math.max(playerInset, Math.min(100 - playerInset, point.x)),
      y: Math.max(FLOOR_START, playerMinY, point.y),
    }
  }
  const { position, setPosition, walking, destination, stop } = useCharacterMovement({
    blocked,
    identity: `${activeActorId}:${room}`,
    constrain: constrainCharacter,
    onSettled: (point) => {
      persistActor(activeActorId, point)
      navigation.arrivedAtExit()
    },
    onInterrupted: (point) => {
      persistActor(activeActorId, point)
      navigation.cancel()
    },
    initialPoint:
      save.castPositions[room][activeActorId] || actorDefault(activeActorId, save.characters),
  })
  const [playerInset, setPlayerInset] = useState(15)
  const sceneRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const player = scene.querySelector<HTMLElement>('.actor-active')
    const observer = new ResizeObserver(() => {
      const { width, height } = scene.getBoundingClientRect()
      if (width) {
        setSceneHeight((height / width) * 1200)
        setSceneSize({ width, height })
        setPlayerMinY((((player?.getBoundingClientRect().height || 150) + 8) / height) * 100)
        setPlayerInset(
          Math.min(35, (((player?.getBoundingClientRect().width || 100) / 2 + 8) / width) * 100),
        )
      }
    })
    observer.observe(scene)
    if (player) observer.observe(player)
    return () => observer.disconnect()
  }, [memory, activeActorId])
  useEffect(() => {
    const timer = setTimeout(() => setHint(false), 7000)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (
      (editor || help || memory || mapOpen || closetOpen || storageView || manipulating) &&
      !navigation.transition
    )
      navigation.cancel()
  }, [editor, help, memory, mapOpen, closetOpen, storageView, manipulating])
  useAmbientMusic(sound, music, blocked)
  function persistActor(id: string, point: Point) {
    setSave((s) => ({
      ...s,
      castPositions: { ...s.castPositions, [room]: { ...s.castPositions[room], [id]: point } },
    }))
  }
  function selectActor(id: string | null) {
    if (!id) return
    navigation.cancel()
    setHint(false)
    clearSelection()
    persistActor(activeActorId, stop())
    if (id === activeActorId) return
    setActiveActorId(id)
    setPosition(save.castPositions[room][id] || actorDefault(id, save.characters))
    if (id !== guestLeo.id) setSave((s) => ({ ...s, selected: id }))
  }
  function placeActor(id: string, point: Point) {
    persistActor(id, point)
    if (id === activeActorId) setPosition(point)
  }
  function dropActor(id: string, point: Point) {
    placeActor(id, point)
    if (id === activeActorId) {
      const door = roomDoors(room).find(
        (d) =>
          point.y >= 72 &&
          point.y <= 94 &&
          (d.side === 'left' ? point.x <= playerInset + 2 : point.x >= 98 - playerInset),
      )
      if (door) navigation.navigate(door.to)
    }
  }
  function edit(newCharacter = false) {
    if (activeActorId === guestLeo.id && !newCharacter) selectActor(save.selected)
    if (newCharacter && save.characters.length >= 5) {
      setToast('Tu familia ya tiene 5 personajes. ¡Puedes personalizarlos!')
      return
    }
    setDraft(
      newCharacter
        ? {
            id: crypto.randomUUID(),
            name: 'Mi personaje',
            skin: skinColors[1],
            shirt: shirtColors[2],
            hair: 'short',
            accessory: 'none',
          }
        : { ...character },
    )
    setEditor(true)
  }
  function commitCharacter() {
    if (!draft || !draft.name.trim()) return
    const next = { ...draft, name: draft.name.trim() }
    setSave((s) => ({
      ...s,
      selected: next.id,
      characters: s.characters.some((c) => c.id === next.id)
        ? s.characters.map((c) => (c.id === next.id ? next : c))
        : [...s.characters, next],
    }))
    const stopped = stop()
    persistActor(activeActorId, stopped)
    setActiveActorId(next.id)
    setPosition(
      next.id === activeActorId
        ? stopped
        : save.castPositions[room][next.id] ||
            actorDefault(next.id, [...save.characters.filter((c) => c.id !== next.id), next]),
    )
    setEditor(false)
    setToast(`¡${next.name} está listo para explorar!`)
  }
  function discover(id: ObjectId) {
    setSave((s) => ({
      ...s,
      collected: [...new Set([...s.collected, id])],
      watered: id === 'plant' ? true : s.watered,
      fed: id === 'pet' ? true : s.fed,
    }))
    if (id === 'music') {
      setMusic((m) => !m)
      setSound(true)
    }
    if (id === 'art') setPainting((p) => (p + 1) % 3)
  }
  function changeScene(next: RoomId) {
    setHint(false)
    clearSelection()
    navigation.navigate(next)
  }
  function visitItem(item: { id: ItemId; room: RoomId }) {
    setMapOpen(false)
    const carried = isOriginalKind(item.id) ? originalItem(item.id) : undefined
    if (carried?.place === 'bag') {
      openStorage('bag')
      return
    }
    if (carried?.place === 'fridge') {
      navigation.navigate('kitchen', () => openStorage('fridge'))
      return
    }
    const destinationRoom = carried?.place || item.room
    navigation.navigate(destinationRoom, () => {
      if (arranging) selectObject(item.id)
      else activateObject(item.id)
    })
  }
  const selectedPoint = selectedObject
    ? save.objectPositions[selectedObject] ||
      (objects.some((o) => o.id === selectedObject)
        ? objectDefault(selectedObject as ObjectId, sceneSize.width, sceneSize.height)
        : furnitureLayout(selectedObject as FurnitureId, sceneSize.width, sceneSize.height).point)
    : null
  function clearSelection() {
    setSelectedObject(null)
    setSelectedCargo(null)
  }
  function selectObject(id: ItemId | null) {
    navigation.cancel()
    stop()
    setHint(false)
    setSelectedObject(id)
    setSelectedCargo(null)
  }
  function placeObject(id: ItemId, point: Point) {
    if (isOriginalKind(id) && save.inventory.some((i) => i.id === originalCargoId(id))) {
      inventory.move(originalCargoId(id), room, point)
      return
    }
    setSave((s) => ({ ...s, objectPositions: { ...s.objectPositions, [id]: point } }))
  }
  function activateObject(id: ItemId) {
    navigation.cancel()
    stop()
    setHint(false)
    clearSelection()
    if (id === 'wardrobe') setClosetOpen(true)
    else if (id === 'fridge') openStorage('fridge')
    else if (objects.some((o) => o.id === id)) discover(id as ObjectId)
    else if (id === 'nightstand') setOpenFurniture((open) => ({ ...open, [id]: !open[id] }))
  }
  function toggleArranging() {
    navigation.cancel()
    stop()
    clearSelection()
    setArranging((value) => !value)
  }
  function openStorage(view: 'bag' | 'fridge') {
    navigation.cancel()
    stop()
    clearSelection()
    setStorageView(view)
    if (view === 'fridge') setOpenFurniture((open) => ({ ...open, fridge: true }))
  }
  function closeStorage() {
    setStorageView(null)
    setOpenFurniture((open) => ({ ...open, fridge: false }))
  }
  function moveStoredItem(id: string, place: CargoPlace, before?: string) {
    inventory.move(id, place, undefined, before)
  }
  function originalItem(id: ObjectId) {
    return save.inventory.find((i) => i.id === originalCargoId(id))
  }
  function objectLocationLabel(id: ObjectId) {
    const place = originalItem(id)?.place || objects.find((o) => o.id === id)!.room
    return place === 'bag'
      ? 'En la bolsa'
      : place === 'fridge'
        ? 'En la nevera'
        : rooms.find((r) => r.id === place)!.label
  }
  function wear(id: GarmentId) {
    const garment = garments.find((g) => g.id === id)!
    if (id === 'crown' && !save.collected.includes('gift')) return
    setSave((s) => ({
      ...s,
      characters: s.characters.map((c) =>
        c.id !== s.selected
          ? c
          : garment.kind === 'shirt'
            ? { ...c, shirt: garment.color }
            : { ...c, accessory: id === 'bow' ? 'bow' : 'crown' },
      ),
    }))
    setToast(`¡${character.name} estrena ${garment.label.toLowerCase()}!`)
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen()
      else
        setToast(
          'Tu navegador ya usa el espacio disponible. Puedes añadir EmiVerse a tu pantalla de inicio.',
        )
    } catch {
      setToast('No se pudo activar la pantalla completa en este navegador.')
    }
  }
  if (memory)
    return (
      <div className="memory-mode">
        <div className="memory-return">
          <GameButton onPress={() => setMemory(false)}>
            <ArrowLeft size={18} /> Volver a mi mundo
          </GameButton>
          <span>EmiVerse — Created by Emily</span>
        </div>
        <MemoryGame />
      </div>
    )
  return (
    <div
      className="world-app game-screen"
      data-travelling={navigation.travelling}
      data-transition={!!navigation.transition}
      data-arranging={arranging}
    >
      <main
        className={`game-viewport ${navigation.transition ? `room-enter-${navigation.transition.side}` : ''}`}
        style={{ animationDuration: `${navigation.transition?.duration || 0}ms` }}
        aria-label="EmiVerse, mundo de juego"
      >
        <div
          ref={sceneRef}
          className={`world-scene ${garden ? 'garden-scene' : ''}`}
          role="region"
          aria-label={rooms.find((r) => r.id === room)!.region}
          data-room={room}
          onPointerDown={(e) => {
            if (blocked || e.target !== e.currentTarget) return
            const r = e.currentTarget.getBoundingClientRect()
            const target = {
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100,
            }
            if (!isFloorPoint(target)) return
            navigation.cancel()
            setHint(false)
            clearSelection()
            destination.current = constrainCharacter(target.x, target.y)
          }}
        >
          <Scenery room={room} height={sceneHeight} />
          {furniture
            .filter((item) => item.room === room)
            .map((item) => {
              const layout = furnitureLayout(item.id, sceneSize.width, sceneSize.height)
              return (
                <MovableObject
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  point={save.objectPositions[item.id] || layout.point}
                  sceneRef={sceneRef}
                  selected={selectedObject === item.id}
                  disabled={modalBlocked}
                  draggable={arranging}
                  onActivate={activateObject}
                  onSelect={selectObject}
                  onDrop={placeObject}
                  onBusy={setManipulating}
                  depthOffset={0}
                  className="movable-furniture"
                  style={{ width: `${layout.width}%`, aspectRatio: layout.ratio }}
                >
                  <FurnitureArt
                    id={item.id}
                    open={openFurniture[item.id]}
                    contents={save.inventory.filter((i) => i.place === 'fridge').map((i) => i.kind)}
                  />
                  <span className="object-label">{item.label}</span>
                </MovableObject>
              )
            })}
          {objects
            .filter((o) => (originalItem(o.id)?.place || o.room) === room)
            .map((o) => (
              <MovableObject
                key={o.id}
                id={o.id}
                label={o.label}
                point={
                  originalItem(o.id)?.point ||
                  save.objectPositions[o.id] ||
                  objectDefault(o.id, sceneSize.width, sceneSize.height)
                }
                sceneRef={sceneRef}
                selected={selectedObject === o.id}
                disabled={modalBlocked}
                draggable={arranging}
                onActivate={activateObject}
                onSelect={selectObject}
                onDrop={placeObject}
                onBusy={setManipulating}
                className={`object-${o.id} ${save.collected.includes(o.id) ? 'discovered' : ''}`}
              >
                <span className="object-art">
                  {o.id === 'pet' ? (
                    <Pet fed={save.fed} />
                  ) : o.id === 'plant' ? (
                    <Plant bloomed={save.watered} />
                  ) : o.id === 'art' ? (
                    <span className="easel">{['🌈', '🌻', '🦋'][painting]}</span>
                  ) : o.id === 'music' ? (
                    <span className={`record-player ${music ? 'playing' : ''}`}>
                      <i />
                      <b>♪</b>
                    </span>
                  ) : (
                    <span className={`gift-box ${save.collected.includes('gift') ? 'opened' : ''}`}>
                      {save.collected.includes('gift') ? '♛' : '✦'}
                    </span>
                  )}
                </span>
                <span className="object-label">
                  {o.label}
                  <span>{save.collected.includes(o.id) ? '♥' : '+'}</span>
                </span>
              </MovableObject>
            ))}
          <RoomDoors
            room={room}
            disabled={modalBlocked || navigation.travelling}
            onNavigate={changeScene}
          />
          {room === 'shop' && (
            <ShopStock
              disabled={modalBlocked || navigation.travelling}
              onTake={inventory.takeProduct}
            />
          )}
          {save.inventory
            .filter((i) => i.place === room && !isOriginalKind(i.kind))
            .map((item) => (
              <MovableObject
                key={item.id}
                id={item.id}
                label={cargoLabel(item.kind)}
                point={item.point || { x: 55, y: 86 }}
                sceneRef={sceneRef}
                selected={selectedCargo === item.id}
                disabled={modalBlocked}
                draggable={arranging}
                onSelect={(id) => {
                  navigation.cancel()
                  stop()
                  clearSelection()
                  setSelectedCargo(id)
                }}
                onActivate={(id) => inventory.move(id, 'bag')}
                onDrop={(id, point) => inventory.move(id, room, point)}
                onBusy={setManipulating}
                className="loose-cargo"
              >
                <CargoArt kind={item.kind} />
                <span className="object-label">{cargoLabel(item.kind)}</span>
              </MovableObject>
            ))}
          {cast.map((actor) => (
            <MovableCharacter
              key={actor.id}
              character={actor}
              point={
                actor.id === activeActorId
                  ? position
                  : save.castPositions[room][actor.id] || actorDefault(actor.id, save.characters)
              }
              sceneRef={sceneRef}
              selected={actor.id === activeActorId}
              elevateSelection={!selectedObject && !selectedCargo}
              disabled={modalBlocked}
              onSelect={selectActor}
              onDrop={dropActor}
              onCancel={placeActor}
              onBusy={setManipulating}
              walking={actor.id === activeActorId && walking}
              guest={actor.id === guestLeo.id}
            />
          ))}
        </div>
      </main>
      {navigation.transition && snapshot && navigation.transition.duration > 0 && (
        <RoomTransition snapshot={snapshot} transition={navigation.transition} />
      )}
      <header className="game-hud-top" inert={!!navigation.transition}>
        <div className="game-logo">
          <span>✦</span>
          <div>
            EmiVerse<small>Created by Emily</small>
          </div>
        </div>
        <div className="game-status">
          <GameButton
            className="memory-count"
            onPress={() => setMapOpen(true)}
            aria-label="Mis recuerdos"
          >
            <Star size={21} fill="currentColor" />
            {save.collected.length}
            <span>/ 5</span>
          </GameButton>
          <GameButton
            className="round-tool"
            onPress={() => setSound((s) => !s)}
            aria-label={sound ? 'Desactivar sonido' : 'Activar sonido'}
          >
            {sound ? <Volume2 /> : <VolumeX />}
          </GameButton>
          <GameButton
            className="round-tool fullscreen-tool"
            onPress={() => void fullscreen()}
            aria-label="Pantalla completa"
          >
            <Maximize />
          </GameButton>
          <GameButton className="round-tool" onPress={() => setHelp(true)} aria-label="Cómo jugar">
            <CircleHelp />
          </GameButton>
        </div>
      </header>
      <HouseNavigation room={room} travelling={navigation.travelling} onNavigate={changeScene} />
      {navigation.travelling && (
        <div className="travel-status" role="status">
          Recorriendo la casa…
        </div>
      )}
      {hint && (
        <div className="game-hint" role="status">
          <span>☝</span> Toca las puertas para recorrer toda la casa
          <GameButton onPress={() => setHint(false)} aria-label="Cerrar pista">
            <X size={14} />
          </GameButton>
        </div>
      )}
      <div className="game-controls" inert={!!navigation.transition}>
        <div className="game-family" aria-label="Mis personajes">
          {cast.map((c) => (
            <GameButton
              key={c.id}
              className={c.id === activeActorId ? 'selected-character' : ''}
              onPress={() => selectActor(c.id)}
              aria-label={`Jugar con ${c.name}`}
              aria-pressed={c.id === activeActorId}
            >
              <Avatar character={c} />
            </GameButton>
          ))}
          <GameButton
            className="create-character"
            onPress={() => edit(true)}
            aria-label="Crear personaje"
          >
            <Plus />
          </GameButton>
        </div>
        <div className="game-tools">
          <GameButton
            className="bag-button"
            onPress={() => openStorage('bag')}
            aria-label="Abrir bolsa"
          >
            <ShoppingBag />
            <span>
              Bolsa <b>{save.inventory.filter((i) => i.place === 'bag').length}</b>
            </span>
          </GameButton>
          <GameButton
            className="move-button"
            onPress={toggleArranging}
            aria-label="Mover objetos"
            aria-pressed={arranging}
          >
            {arranging ? <Check /> : <Move />}
            <span>{arranging ? 'Listo' : 'Mover'}</span>
          </GameButton>
          <GameButton
            className="map-button"
            onPress={() => setMapOpen(true)}
            aria-label="Abrir mapa de aventuras"
          >
            <Map />
            <span>Aventuras</span>
          </GameButton>
          <GameButton
            className="memory-button"
            onPress={() => setMemory(true)}
            aria-label="¡Vamos a jugar!"
          >
            <Gamepad2 />
            <span>Memoria</span>
          </GameButton>
          <GameButton className="dress-button" onPress={() => edit()} aria-label="Mi vestidor">
            <Palette />
            <span>Vestidor</span>
          </GameButton>
        </div>
      </div>
      {arranging && selectedObject && !manipulating && !modalBlocked && (
        <div
          className="object-toolbar"
          role="toolbar"
          aria-label="Objeto seleccionado"
          data-placement={selectedPoint && selectedPoint.y > 60 ? 'top' : 'bottom'}
        >
          <strong>
            {[...objects, ...furniture].find((item) => item.id === selectedObject)!.label}
          </strong>
          {isOriginalKind(selectedObject) && (
            <GameButton
              onPress={() => {
                inventory.takeOriginal(selectedObject)
                clearSelection()
              }}
            >
              Llevar en bolsa
            </GameButton>
          )}
          <GameButton onPress={() => clearSelection()} aria-label="Soltar objeto">
            <X size={18} />
          </GameButton>
        </div>
      )}
      {arranging && selectedCargo && !manipulating && !modalBlocked && (
        <div
          className="object-toolbar"
          role="toolbar"
          aria-label="Objeto seleccionado"
          data-placement="top"
        >
          <GameButton
            onPress={() => {
              inventory.move(selectedCargo, 'bag')
              setSelectedCargo(null)
            }}
          >
            Llevar en bolsa
          </GameButton>
          <GameButton onPress={() => setSelectedCargo(null)} aria-label="Soltar objeto">
            <X size={18} />
          </GameButton>
        </div>
      )}
      {storageView && (
        <StoragePanel
          mode={storageView}
          items={save.inventory}
          room={room}
          onMove={moveStoredItem}
          onClose={closeStorage}
        />
      )}
      <span className="game-signature">EmiVerse — Created by Emily</span>
      {storageBlocked && (
        <p className="world-storage" role="status">
          Tu navegador bloquea el guardado. Puedes jugar durante esta sesión.
        </p>
      )}
      {mapOpen && (
        <WorldDialog title="Mi mapa de aventuras" onClose={() => setMapOpen(false)}>
          <p className="map-intro">¡Cinco pequeños descubrimientos te esperan!</p>
          <div className="adventure-list">
            {objects.map((o) => (
              <GameButton
                key={o.id}
                onPress={() => {
                  visitItem(o)
                }}
              >
                <span>{o.emoji}</span>
                <div>
                  <strong>{o.label}</strong>
                  <small>{objectLocationLabel(o.id)}</small>
                </div>
                <b>{save.collected.includes(o.id) ? '★' : <ArrowRight />}</b>
              </GameButton>
            ))}
          </div>
          <h3 className="furniture-map-title">Organizar mi mundo</h3>
          <div className="furniture-map">
            {furniture.map((item) => (
              <GameButton
                key={item.id}
                onPress={() => {
                  visitItem(item)
                }}
              >
                {item.label}
                <ArrowRight size={15} />
              </GameButton>
            ))}
          </div>
        </WorldDialog>
      )}
      {toast && (
        <div className="world-toast" role="status">
          <Sparkles size={18} />
          {toast}
          <GameButton onPress={() => setToast('')} aria-label="Cerrar aviso">
            <X size={15} />
          </GameButton>
        </div>
      )}
      {editor && draft && (
        <WorldDialog title="Un personaje tan único como tú" onClose={() => setEditor(false)}>
          <CharacterEditor
            draft={draft}
            crownUnlocked={save.collected.includes('gift')}
            onChange={setDraft}
            onSave={commitCharacter}
          />
        </WorldDialog>
      )}
      {closetOpen && (
        <WorldDialog title="Mi armario" onClose={() => setClosetOpen(false)}>
          <Wardrobe
            slots={save.closetSlots}
            crownUnlocked={save.collected.includes('gift')}
            name={character.name}
            onChange={(closetSlots) => setSave((s) => ({ ...s, closetSlots }))}
            onWear={wear}
          />
        </WorldDialog>
      )}
      {help && (
        <WorldDialog title="Tu universo cabe en tus manos" onClose={() => setHelp(false)}>
          <div className="help-steps">
            <p>
              <b>01 · Crea tu protagonista</b>Elige su nombre, colores y peinado en «Mi vestidor».
              Puedes crear hasta 5 personajes.
            </p>
            <p>
              <b>02 · Explora a tu manera</b>Toca un personaje para seleccionarlo y arrástralo con
              el dedo. Toca el suelo para que camine hasta allí. Puedes mover a todos, incluido Leo.
            </p>
            <p>
              <b>03 · Dale vida a tu mundo</b>Toca un objeto para activarlo o el armario para
              abrirlo. Pulsa «Mover» para reorganizar objetos y muebles arrastrándolos; pulsa
              «Listo» para seguir jugando. Los personajes caminan por el suelo y no pueden subir por
              las paredes. Recorre tienda, jardín, casita, cocina y dormitorio tocando las puertas.
              El personaje camina hasta ellas y la cámara se desliza al cruzar.
            </p>
            <p>
              <b>04 · Llena tu nevera</b>Toca productos en la tienda para llevarlos en la bolsa.
              Abre la nevera y arrástralos a sus estantes o de vuelta a la bolsa. Puedes guardar
              comida y juguetes. Para llevar un objeto de la casa, selecciónalo en «Mover» y pulsa
              «Llevar en bolsa». Usa «Más» para recorrer tus cosas.
            </p>
            <p>
              <b>05 · Vuelve cuando quieras</b>Tus personajes y recuerdos se guardan en este
              navegador. No necesitas una cuenta. El sonido es opcional.
            </p>
          </div>
          <GameButton className="world-primary wide" onPress={() => setHelp(false)}>
            ¡Vamos a imaginar! <Sparkles size={17} />
          </GameButton>
        </WorldDialog>
      )}
    </div>
  )
}
