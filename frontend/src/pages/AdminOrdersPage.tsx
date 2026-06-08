import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getOrders, updateOrderStatus } from "../api/orderApi"
import type { OrderResponse } from "../types/Order"
import { isAdmin } from "../utils/authStorage"

const ORDER_STATUSES: OrderResponse["status"][] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]

function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data)
      })
      .catch(() => {
        setError("Could not load orders.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  async function handleStatusChange(
    orderId: number,
    status: OrderResponse["status"]
  ) {
    setUpdatingOrderId(orderId)

    try {
      const updatedOrder = await updateOrderStatus(orderId, status)

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      )
    } catch {
      setError("Could not update order status.")
    } finally {
      setUpdatingOrderId(null)
    }
  }

if (!isAdmin()) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-white">
      <h1 className="text-3xl font-bold">Access denied</h1>
      <p className="mt-3 text-neutral-400">
        You need an admin account to access this page.
      </p>
      <Link
        to="/login"
        className="mt-6 rounded-xl bg-white px-5 py-3 font-medium text-neutral-950 hover:bg-neutral-200"
      >
        Login as admin
      </Link>
    </main>
  )
}

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        Loading orders...
      </main>
    )
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
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold">Orders</h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              Manage customer orders, view totals and update order status.
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-xl bg-white px-4 py-2 font-medium text-neutral-950 hover:bg-neutral-200"
          >
            Storefront
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-neutral-400">
            No orders found.
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <section
                key={order.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
              >
                <div className="flex flex-col gap-4 border-b border-neutral-800 pb-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Order #{order.id}</h2>

                    <p className="mt-1 text-sm text-neutral-400">
                      Created at: {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <p className="mt-1 text-sm text-neutral-400">
                      Total:{" "}
                      <span className="font-semibold text-white">
                        {order.totalPrice.toFixed(2)} lei
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="text-sm text-neutral-400">
                      Status
                    </label>

                    <select
                      value={order.status}
                      disabled={updatingOrderId === order.id}
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value as OrderResponse["status"]
                        )
                      }
                      className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white disabled:opacity-60"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Items
                  </h3>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}`}
                        className="flex items-center justify-between rounded-xl bg-neutral-950 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="mt-1 text-sm text-neutral-400">
                            Quantity: {item.quantity} · Unit price:{" "}
                            {item.priceAtPurchase.toFixed(2)} lei
                          </p>
                        </div>

                        <p className="font-semibold">
                          {item.subtotal.toFixed(2)} lei
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm text-neutral-400 hover:text-white"
                  >
                    View public order page →
                  </Link>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminOrdersPage