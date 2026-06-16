type LoadingStateProps = {
  message?: string
}

function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />

        <p className="text-sm text-neutral-400">{message}</p>
      </div>
    </main>
  )
}

export default LoadingState