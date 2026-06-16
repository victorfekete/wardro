import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getOrderById } from "../api/orderApi"
import type { OrderResponse } from "../types/Order"
import LoadingState from "../components/LoadingState"

const orderSteps = ["PENDING", "PAID", "SHIPPED", "DELIVERED"] as const

function getStatusStep(status: string) {
  if (status === "CANCELLED") {
    return -1
  }

  const currentIndex = orderSteps.findIndex((step) => step === status)

  return currentIndex
}

function getStatusBadgeClass(status: string) {
  if (status === "CANCELLED") {
    return "border-red-900 bg-red-950 text-red-300"
  }

  if (status === "DELIVERED") {
    return "border-green-900 bg-green-950 text-green-300"
  }

  return "border-yellow-900 bg-yellow-950 text-yellow-300"
}

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
    return <LoadingState message="Loading order..." />
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

  const currentStep = getStatusStep(order.status)
  const statusBadgeClass = getStatusBadgeClass(order.status)
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Order #{order.id}
            </h1>

            <p className="mt-2 text-neutral-400">
              Placed on {formattedDate}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-4 py-2 text-sm font-medium ${statusBadgeClass}`}
            >
              {order.status}
            </span>

            <Link
              to="/products"
              className="rounded-xl bg-white px-4 py-2 font-medium text-neutral-950 hover:bg-neutral-200"
            >
              Continue shopping
            </Link>
          </div>
        </div>

        <section className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-xl font-semibold">Order progress</h2>

          {order.status === "CANCELLED" ? (
            <p className="mt-4 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-red-300">
              This order has been cancelled.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {orderSteps.map((step, index) => {
                const isCompleted = index <= currentStep

                return (
                  <div key={step} className="flex flex-col gap-3">
                    <div
                      className={`h-2 rounded-full ${
                        isCompleted ? "bg-white" : "bg-neutral-700"
                      }`}
                    />

                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isCompleted ? "text-white" : "text-neutral-500"
                        }`}
                      >
                        {step}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {index === 0 && "Order created"}
                        {index === 1 && "Payment confirmed"}
                        {index === 2 && "Order shipped"}
                        {index === 3 && "Delivered to customer"}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <div className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-xl font-semibold">Delivery details</h2>

          <div className="mt-4 grid gap-4 text-sm text-neutral-300 md:grid-cols-2">
            <div>
              <p className="text-neutral-500">Full name</p>
              <p className="mt-1 text-white">{order.deliveryFullName}</p>
            </div>

            <div>
              <p className="text-neutral-500">Phone</p>
              <p className="mt-1 text-white">{order.deliveryPhone}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-neutral-500">Address</p>
              <p className="mt-1 text-white">{order.deliveryAddress}</p>
            </div>

            <div>
              <p className="text-neutral-500">City</p>
              <p className="mt-1 text-white">{order.deliveryCity}</p>
            </div>

            <div>
              <p className="text-neutral-500">Postal code</p>
              <p className="mt-1 text-white">{order.deliveryPostalCode}</p>
            </div>

            {order.deliveryNotes && (
              <div className="md:col-span-2">
                <p className="text-neutral-500">Notes</p>
                <p className="mt-1 text-white">{order.deliveryNotes}</p>
              </div>
            )}
          </div>
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