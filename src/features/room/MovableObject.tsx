import DraggableEntity, { type DraggableProps } from '../../ui/DraggableEntity'
import type { ItemId } from '../../domain/layout'
export default function MovableObject<Id extends string = ItemId>(props: DraggableProps<Id>) {
  return <DraggableEntity {...props} />
}
