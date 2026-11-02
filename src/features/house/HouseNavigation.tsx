import { BedDouble, CookingPot, Home, Sprout } from 'lucide-react'
import { roomDoors, rooms, type RoomId } from '../../domain/house'
import GameButton from '../../ui/GameButton'
const icons = {
  home: <Home />,
  kitchen: <CookingPot />,
  bedroom: <BedDouble />,
  garden: <Sprout />,
}
export function HouseNavigation({
  room,
  travelling,
  onNavigate,
}: {
  room: RoomId
  travelling: boolean
  onNavigate: (room: RoomId) => void
}) {
  return (
    <nav className="scene-tabs house-tabs" aria-label="Habitaciones">
      {rooms.map((item) => (
        <GameButton
          key={item.id}
          className={room === item.id ? 'chosen' : ''}
          disabled={travelling}
          onPress={() => onNavigate(item.id)}
          aria-current={room === item.id ? 'location' : undefined}
        >
          {icons[item.id]}
          <span>{item.label}</span>
        </GameButton>
      ))}
    </nav>
  )
}
export function RoomDoors({
  room,
  disabled,
  onNavigate,
}: {
  room: RoomId
  disabled: boolean
  onNavigate: (room: RoomId) => void
}) {
  return (
    <>
      {roomDoors(room).map((door) => {
        const target = rooms.find((r) => r.id === door.to)!
        return (
          <GameButton
            key={door.to}
            className={`room-door room-door-${door.side}`}
            disabled={disabled}
            onPress={() => onNavigate(door.to)}
            aria-label={`Ir a ${target.label}`}
          >
            <svg viewBox="0 0 80 140" aria-hidden="true">
              <path
                d="M8 135V40Q8 5 40 5t32 35v95Z"
                fill="#bc8c8c"
                stroke="#785561"
                strokeWidth="4"
              />
              <path
                d="M17 135V42q0-26 23-26t23 26v93"
                fill={target.tone}
                stroke="#785561"
                strokeWidth="3"
              />
              <path d="M24 128V44q0-19 16-19" fill="none" stroke="#fff2d0" strokeWidth="5" />
              <path d="m23 126 34-22v31H23Z" fill="#fff1cf" opacity=".6" />
              <circle cx="54" cy="84" r="4" fill="#ffe298" stroke="#9d7380" strokeWidth="2" />
            </svg>
            <span>{target.label}</span>
          </GameButton>
        )
      })}
    </>
  )
}
