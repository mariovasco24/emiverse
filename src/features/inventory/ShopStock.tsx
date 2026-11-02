import { products, type ProductId } from '../../domain/inventory'
import GameButton from '../../ui/GameButton'
import CargoArt from './CargoArt'
export default function ShopStock({
  disabled,
  onTake,
}: {
  disabled: boolean
  onTake: (kind: ProductId) => void
}) {
  return (
    <div className="shop-stock" role="group" aria-label="Productos de la tienda">
      {products.map((product, i) => (
        <GameButton
          key={product.id}
          disabled={disabled}
          aria-label={`Tomar ${product.label}`}
          onPress={() => onTake(product.id)}
          style={{ left: `${14 + (i % 5) * 18}%`, top: `${i < 5 ? 34 : 51}%` }}
        >
          <CargoArt kind={product.id} />
          <span>{product.label}</span>
        </GameButton>
      ))}
    </div>
  )
}
