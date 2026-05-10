import type { Product } from "../types/Product"
import { Link } from "react-router-dom"

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-sm">
      <div className="aspect-[4/5] overflow-hidden rounded-xl bg-neutral-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-4">
        <p className="text-sm text-neutral-400">{product.categoryName}</p>

        <h2 className="mt-1 text-lg font-semibold text-white">
          {product.name}
        </h2>

        <p className="mt-1 text-sm text-neutral-400">{product.brand}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {product.price} lei
          </span>

          <span className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-300">
            {product.size}
          </span>
        </div>

        <p className="mt-2 text-sm text-neutral-500">
          {product.color} · Stock: {product.stock}
        </p>

        <Link
          to={`/products/${product.id}`}
          className="mt-4 block w-full rounded-xl bg-white px-4 py-2 text-center font-medium text-neutral-950 hover:bg-neutral-200"
        >
          View product
        </Link>
      </div>
    </div>
  )
}

export default ProductCard