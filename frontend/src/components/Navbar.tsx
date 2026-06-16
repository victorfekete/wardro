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
    <header className="border-b border-neutral-900 bg-neutral-950 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link to="/" className="text-lg font-bold tracking-[0.3em]">
          WARDRO
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-3">
          <Link
            to="/products"
            className="rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
          >
            Products
          </Link>

          {authUser?.role !== "ADMIN" && (
            <Link
              to="/cart"
              className="rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
            >
              Cart
            </Link>
          )}


          {authUser && authUser.role !== "ADMIN" && (
            <Link
              to="/my-orders"
              className="rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
            >
              My Orders
            </Link>
          )}

          {authUser?.role === "ADMIN" && (
            <>
              <Link
                    to="/admin"
                    className="rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  >
                    Dashboard
                  </Link>

              <Link
                to="/admin/products"
                className="rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                Admin Products
              </Link>

              <Link
                to="/admin/orders"
                className="rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                Admin Orders
              </Link>

              <Link
                to="/admin/categories"
                className="rounded-xl border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                Admin Categories
              </Link>

            </>
          )}

          {authUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
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