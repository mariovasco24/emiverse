import { Heart } from 'lucide-react'
import Avatar from '../../Character'
import DraggableEntity, { type DraggableProps } from '../../ui/DraggableEntity'
import type { Character } from '../../domain/world'
type Props = Omit<DraggableProps<string>, 'children' | 'label' | 'id'> & {
  character: Character
  walking: boolean
  guest: boolean
}
export default function MovableCharacter({
  character,
  walking,
  guest,
  selected,
  elevateSelection = true,
  ...props
}: Props) {
  return (
    <DraggableEntity
      {...props}
      id={character.id}
      label={character.name}
      selected={selected}
      kind="character"
      elevateSelection={elevateSelection}
      depthOffset={selected && elevateSelection ? 1 : -20}
      className={`world-player movable-character ${selected ? 'actor-active' : ''} ${guest ? 'guest-character' : ''}`}
    >
      <span className="player-name">
        {character.name}
        {selected && <Heart size={10} fill="currentColor" />}
      </span>
      <Avatar character={character} walking={walking} />
    </DraggableEntity>
  )
}
