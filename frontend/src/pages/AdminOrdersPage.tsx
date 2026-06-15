import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getOrders, updateOrderStatus } from "../api/orderApi"
import type { OrderResponse, OrderStatus } from "../types/Order"
import { isAdmin } from "../utils/authStorage"
import Navbar from "../components/Navbar"

const orderStatuses: OrderStatus[] = [
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
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      setLoading(true)
      setError(null)

      const ordersData = await getOrders()

      setOrders(ordersData)
    } catch {
      setError("Could not load orders.")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(orderId: number, status: OrderStatus) {
    try {
      setUpdatingOrderId(orderId)
      setError(null)

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
      <>
        <Navbar />

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
      </>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
          Loading orders...
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold">Orders</h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              View customer orders and update their status.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <p className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-neutral-400">
              No orders found.
            </p>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Order #{order.id}
                      </h2>

                      <p className="mt-1 text-sm text-neutral-400">
                        Created at:{" "}
                        {new Date(order.createdAt).toLocaleString("en-GB")}
                      </p>

                      {order.customerEmail && (
                        <p className="mt-1 text-sm text-neutral-400">
                          Customer:{" "}
                          <span className="text-white">
                            {order.customerName}
                          </span>{" "}
                          · {order.customerEmail}
                        </p>
                      )}

                      {order.deliveryFullName && (
                        <p className="mt-1 text-sm text-neutral-400">
                          Delivery:{" "}
                          <span className="text-white">
                            {order.deliveryFullName}
                          </span>{" "}
                          · {order.deliveryCity}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 md:items-end">
                      <p className="text-xl font-bold">
                        {order.totalPrice.toFixed(2)} lei
                      </p>

                      <select
                        value={order.status}
                        disabled={updatingOrderId === order.id}
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value as OrderStatus
                          )
                        }
                        className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-neutral-800 pt-5">
                    <h3 className="font-semibold">Items</h3>

                    <div className="mt-3 space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between text-sm text-neutral-300"
                        >
                          <span>
                            {item.productName} × {item.quantity}
                          </span>

                          <span>{item.subtotal.toFixed(2)} lei</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default AdminOrdersPage