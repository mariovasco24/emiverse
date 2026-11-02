import DraggableEntity, { type DraggableProps } from '../../ui/DraggableEntity'
import type { ItemId } from '../../domain/layout'
export default function MovableObject(props: DraggableProps<ItemId>) {
  return <DraggableEntity {...props} />
}
