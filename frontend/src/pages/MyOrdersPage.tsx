import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getMyOrders } from "../api/orderApi"
import type { OrderResponse } from "../types/Order"
import { isAuthenticated } from "../utils/authStorage"
import Navbar from "../components/Navbar"
import LoadingState from "../components/LoadingState"

function MyOrdersPage() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login")
      return
    }

    getMyOrders()
      .then((data) => {
        setOrders(data)
      })
      .catch(() => {
        setError("Could not load your orders.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [navigate])

  if (loading) {
    return <LoadingState message="Loading your orders..." />
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white">
        <p className="text-red-400">{error}</p>

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
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro
            </p>

            <h1 className="mt-2 text-4xl font-bold">My Orders</h1>

            <p className="mt-3 text-neutral-400">
              View your previous orders and their current status.
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-xl bg-white px-4 py-2 font-medium text-neutral-950 hover:bg-neutral-200"
          >
            Continue shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-neutral-400">
            You have no orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-2xl border border-neutral-800 bg-neutral-900 p-6 hover:bg-neutral-800"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Order #{order.id}</h2>

                    <p className="mt-1 text-sm text-neutral-400">
                      Created at: {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <p className="mt-1 text-sm text-neutral-400">
                      Items: {order.items.length}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-semibold">{order.totalPrice.toFixed(2)} lei</p>

                    <p className="mt-1 text-sm text-neutral-400">
                      Status:{" "}
                      <span className="font-medium text-white">
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default MyOrdersPage