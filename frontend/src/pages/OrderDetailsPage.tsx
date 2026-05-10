import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getOrderById } from "../api/orderApi"
import type { OrderResponse } from "../types/Order"

function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("Order id is missing.")
      setLoading(false)
      return
    }

    getOrderById(id)
      .then((data) => {
        setOrder(data)
      })
      .catch(() => {
        setError("Could not load order.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        Loading order...
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white">
        <p className="text-red-400">{error ?? "Order not found."}</p>

        <Link
          to="/products"
          className="mt-4 rounded-xl bg-white px-4 py-2 font-medium text-neutral-950 hover:bg-neutral-200"
        >
          Back to products
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Order #{order.id}
            </h1>

            <p className="mt-2 text-neutral-400">
              Status:{" "}
              <span className="font-medium text-white">{order.status}</span>
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-xl bg-white px-4 py-2 font-medium text-neutral-950 hover:bg-neutral-200"
          >
            Continue shopping
          </Link>
        </div>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-xl font-semibold">Order items</h2>

          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between border-b border-neutral-800 pb-4 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="mt-1 text-sm text-neutral-400">
                    Quantity: {item.quantity} · Price:{" "}
                    {item.priceAtPurchase.toFixed(2)} lei
                  </p>
                </div>

                <p className="font-semibold">
                  {item.subtotal.toFixed(2)} lei
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-neutral-800 pt-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{order.totalPrice.toFixed(2)} lei</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default OrderDetailsPage