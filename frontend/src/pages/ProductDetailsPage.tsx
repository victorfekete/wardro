import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getProductById } from "../api/productApi"
import type { Product } from "../types/Product"
import { addProductToCart } from "../utils/cartStorage"

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("Product id is missing.")
      setLoading(false)
      return
    }

    getProductById(id)
      .then((data) => {
        setProduct(data)
      })
      .catch(() => {
        setError("Could not load product.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])


    function handleAddToCart() {
        if (!product) {
            return
        }

    addProductToCart(product)
    alert("Product added to cart.")
  }
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        Loading product...
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white">
        <p className="text-red-400">{error ?? "Product not found."}</p>

        <div className="flex items-center justify-between">
          <Link
            to="/products"
            className="text-sm text-neutral-400 hover:text-white"
          >
            ← Back to products
          </Link>

          <Link
            to="/cart"
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
          >
            Cart
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/products"
          className="text-sm text-neutral-400 hover:text-white"
        >
          ← Back to products
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-neutral-900">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <section>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              {product.categoryName}
            </p>

            <h1 className="mt-3 text-4xl font-bold">{product.name}</h1>

            <p className="mt-4 text-lg text-neutral-400">
              {product.description}
            </p>

            <div className="mt-6 text-3xl font-bold">
              {product.price} lei
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <p className="text-sm text-neutral-500">Brand</p>
                <p className="mt-1 font-medium">{product.brand}</p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <p className="text-sm text-neutral-500">Color</p>
                <p className="mt-1 font-medium">{product.color}</p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <p className="text-sm text-neutral-500">Size</p>
                <p className="mt-1 font-medium">{product.size}</p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <p className="text-sm text-neutral-500">Stock</p>
                <p className="mt-1 font-medium">{product.stock}</p>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-8 w-full rounded-2xl bg-white px-6 py-4 font-semibold text-neutral-950 hover:bg-neutral-200"
            >
              Add to Cart
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}

export default ProductDetailsPage