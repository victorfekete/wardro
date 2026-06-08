import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../api/authApi"
import { saveAuthData } from "../utils/authStorage"

function RegisterPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const authResponse = await register({
        fullName,
        email,
        password,
      })

      saveAuthData(authResponse)
      navigate("/products")
    } catch {
      setError("Could not create account. Please try again.")
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

        <h1 className="mt-2 text-3xl font-bold">Create account</h1>

        <p className="mt-2 text-neutral-400">
          Register to place orders and save your shopping flow.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-neutral-400">Full name</label>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
            />
          </div>

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
              minLength={6}
              className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-neutral-950 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-sm text-neutral-400">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage