import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAdminProducts } from "../api/productApi"
import { getOrders } from "../api/orderApi"
import type { Product } from "../types/Product"
import type { OrderResponse } from "../types/Order"
import { isAdmin } from "../utils/authStorage"
import Navbar from "../components/Navbar"

function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      setError(null)

      const [productsData, ordersData] = await Promise.all([
        getAdminProducts(),
        getOrders(),
      ])

      setProducts(productsData)
      setOrders(ordersData)
    } catch {
      setError("Could not load dashboard data.")
    } finally {
      setLoading(false)
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
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
          Loading dashboard...
        </main>
      </>
    )
  }

  const totalProducts = products.length
  const activeProducts = products.filter((product) => product.active).length
  const inactiveProducts = products.filter((product) => !product.active).length

  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length

  const totalRevenue = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((total, order) => total + order.totalPrice, 0)

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold">Dashboard</h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              Quick overview of products, orders and store revenue.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm text-neutral-500">Total products</p>
              <p className="mt-3 text-4xl font-bold">{totalProducts}</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm text-neutral-500">Active products</p>
              <p className="mt-3 text-4xl font-bold text-green-300">
                {activeProducts}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm text-neutral-500">Inactive products</p>
              <p className="mt-3 text-4xl font-bold text-red-300">
                {inactiveProducts}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm text-neutral-500">Total orders</p>
              <p className="mt-3 text-4xl font-bold">{totalOrders}</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm text-neutral-500">Pending orders</p>
              <p className="mt-3 text-4xl font-bold text-yellow-300">
                {pendingOrders}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <p className="text-sm text-neutral-500">Total revenue</p>
              <p className="mt-3 text-4xl font-bold">
                {totalRevenue.toFixed(2)} lei
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="text-xl font-semibold">Product management</h2>

              <p className="mt-3 text-neutral-400">
                Add, edit, deactivate and reactivate products.
              </p>

              <Link
                to="/admin/products"
                className="mt-5 inline-block rounded-xl bg-white px-5 py-3 font-medium text-neutral-950 hover:bg-neutral-200"
              >
                Manage products
              </Link>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="text-xl font-semibold">Order management</h2>

              <p className="mt-3 text-neutral-400">
                View customer orders and update their status.
              </p>

              <Link
                to="/admin/orders"
                className="mt-5 inline-block rounded-xl bg-white px-5 py-3 font-medium text-neutral-950 hover:bg-neutral-200"
              >
                Manage orders
              </Link>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="text-xl font-semibold">Category management</h2>

              <p className="mt-3 text-neutral-400">
                Add, edit, deactivate and reactivate categories.
              </p>

              <Link
                to="/admin/categories"
                className="mt-5 inline-block rounded-xl bg-white px-5 py-3 font-medium text-neutral-950 hover:bg-neutral-200"
              >
                Manage categories
              </Link>
            </div>

          </section>
        </div>
      </main>
    </>
  )
}

export default AdminDashboardPage