import { Link, useNavigate } from "react-router-dom"
import { clearAuthData, getAuthUser } from "../utils/authStorage"

function Navbar() {
  const navigate = useNavigate()
  const authUser = getAuthUser()

  function handleLogout() {
    clearAuthData()
    navigate("/login")
    window.location.reload()
  }

  return (
    <header className="border-b border-neutral-900 bg-neutral-950 px-4 py-4 text-white sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="text-lg font-bold tracking-[0.3em]">
          WARDRO
        </Link>

        <nav className="flex w-full gap-3 overflow-x-auto pb-2 md:w-auto md:flex-wrap md:items-center md:justify-end md:pb-0">
          <Link
            to="/products"
            className="shrink-0 rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
          >
            Products
          </Link>

          {authUser?.role !== "ADMIN" && (
            <Link
              to="/cart"
              className="shrink-0 rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
            >
              Cart
            </Link>
          )}

          {authUser && authUser.role !== "ADMIN" && (
            <Link
              to="/my-orders"
              className="shrink-0 rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
            >
              My Orders
            </Link>
          )}

          {authUser?.role === "ADMIN" && (
            <>
              <Link
                to="/admin"
                className="shrink-0 rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/products"
                className="shrink-0 rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                Admin Products
              </Link>

              <Link
                to="/admin/orders"
                className="shrink-0 rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                Admin Orders
              </Link>

              <Link
                to="/admin/categories"
                className="shrink-0 rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                Admin Categories
              </Link>
            </>
          )}

          {authUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar