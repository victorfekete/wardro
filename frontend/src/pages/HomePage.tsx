import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getAuthUser } from "../utils/authStorage"

function HomePage() {
  const authUser = getAuthUser()

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 px-6 text-white">
        <section className="mx-auto flex max-w-7xl flex-col items-center justify-center py-28 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">
            Wardro
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Build your outfit with curated fashion pieces.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-neutral-400">
            Wardro is a full-stack fashion e-commerce platform where users can
            browse products, filter by style, add items to cart, place orders
            and track their order history.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-neutral-950 hover:bg-neutral-200"
            >
              Shop now
            </Link>

            {!authUser && (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-neutral-700 px-6 py-3 font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl border border-neutral-700 px-6 py-3 font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white"
                >
                  Register
                </Link>
              </>
            )}

            {authUser?.role === "ADMIN" && (
              <Link
                to="/admin/products"
                className="rounded-xl border border-neutral-700 px-6 py-3 font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                Admin dashboard
              </Link>
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 pb-20 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Product browsing</h2>
            <p className="mt-3 text-neutral-400">
              Browse fashion products with categories, search, filtering and
              sorting.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Cart and checkout</h2>
            <p className="mt-3 text-neutral-400">
              Add products to cart, update quantities and create authenticated
              orders.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Admin management</h2>
            <p className="mt-3 text-neutral-400">
              Admin users can manage products, view orders and update order
              statuses.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage