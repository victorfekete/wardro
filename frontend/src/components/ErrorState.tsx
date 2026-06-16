import { Link } from "react-router-dom"

type ErrorStateProps = {
  title?: string
  message: string
  linkTo?: string
  linkLabel?: string
}

function ErrorState({
  title = "Something went wrong",
  message,
  linkTo,
  linkLabel,
}: ErrorStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="max-w-md rounded-2xl border border-red-900 bg-red-950/30 p-6 text-center">
        <h1 className="text-2xl font-bold text-red-300">{title}</h1>

        <p className="mt-3 text-neutral-300">{message}</p>

        {linkTo && linkLabel && (
          <Link
            to={linkTo}
            className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-medium text-neutral-950 hover:bg-neutral-200"
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </main>
  )
}

export default ErrorState