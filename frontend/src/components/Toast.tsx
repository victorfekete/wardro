type ToastType = "success" | "error" | "info"

type ToastProps = {
  message: string | null
  type?: ToastType
  onClose: () => void
}

function Toast({ message, type = "info", onClose }: ToastProps) {
  if (!message) {
    return null
  }

  const styles = {
    success: "border-green-900 bg-green-950 text-green-300",
    error: "border-red-900 bg-red-950 text-red-300",
    info: "border-neutral-700 bg-neutral-900 text-neutral-200",
  }

  return (
    <div className="fixed right-4 top-24 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div
        className={`rounded-2xl border px-4 py-3 shadow-2xl ${styles[type]}`}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium">{message}</p>

          <button
            type="button"
            onClick={onClose}
            className="text-sm opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast