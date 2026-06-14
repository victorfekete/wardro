import { Link } from "react-router-dom"
import type { Product } from "../types/Product"

type ProductCardProps = {
  product: Product
}

function getStockLabel(stock: number) {
  if (stock === 0) {
    return "Out of stock"
  }

  if (stock <= 5) {
    return "Low stock"
  }

  return "In stock"
}

function getStockBadgeClass(stock: number) {
  if (stock === 0) {
    return "border-red-900 bg-red-950 text-red-300"
  }

  if (stock <= 5) {
    return "border-yellow-900 bg-yellow-950 text-yellow-300"
  }

  return "border-green-900 bg-green-950 text-green-300"
}

function ProductCard({ product }: ProductCardProps) {
  const stockLabel = getStockLabel(product.stock)
  const stockBadgeClass = getStockBadgeClass(product.stock)

  return (
    <div className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition hover:-translate-y-1 hover:border-neutral-700">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-800">
        <img
          src={product.imageUrl || "/icons.svg"}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = "/icons.svg"
          }}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <span
          className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-medium ${stockBadgeClass}`}
        >
          {stockLabel}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-400">{product.categoryName}</p>

            <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-white">
              {product.name}
            </h2>
          </div>

          <span className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-300">
            {product.size}
          </span>
        </div>

        <p className="mt-2 text-sm text-neutral-500">
          {product.brand} · {product.color}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            {product.price.toFixed(2)} lei
          </span>

          <span className="text-sm text-neutral-500">
            Stock: {product.stock}
          </span>
        </div>

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