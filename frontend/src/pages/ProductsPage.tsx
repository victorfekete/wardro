import { useEffect, useState } from "react"
import { getProducts } from "../api/productApi"
import ProductCard from "../components/ProductCard"
import type { Product } from "../types/Product"

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.content)
      })
      .catch(() => {
        setError("Could not load products.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        Loading products...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Wardro
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Discover your next outfit
          </h1>

          <p className="mt-3 max-w-2xl text-neutral-400">
            Browse curated fashion pieces, filter by style and build outfits
            that match your look.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-neutral-400">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default ProductsPage