import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../api/authApi"
import { saveAuthData } from "../utils/authStorage"

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const authResponse = await login({
        email,
        password,
      })

      saveAuthData(authResponse)

      if (authResponse.role === "ADMIN") {
        navigate("/admin/products")
      } else {
        navigate("/products")
      }
    } catch {
      setError("Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <section className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Wardro
        </p>

        <h1 className="mt-2 text-3xl font-bold">Login</h1>

        <p className="mt-2 text-neutral-400">
          Sign in to continue shopping or manage the store.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-neutral-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-neutral-950 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-neutral-400">
          Do not have an account?{" "}
          <Link to="/register" className="text-white hover:underline">
            Register
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage