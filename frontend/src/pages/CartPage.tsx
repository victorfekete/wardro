import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { CartItem } from "../types/CartItem"
import {
  getCartItems,
  removeProductFromCart,
  updateCartItemQuantity,
} from "../utils/cartStorage"

function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    setCartItems(getCartItems())
  }, [])

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  function handleRemove(productId: number) {
    removeProductFromCart(productId)
    setCartItems(getCartItems())
  }

  function handleQuantityChange(productId: number, quantity: number) {
    updateCartItemQuantity(productId, quantity)
    setCartItems(getCartItems())
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-white">
        <h1 className="text-4xl font-bold">Your cart is empty</h1>

        <p className="mt-3 text-neutral-400">
          Add some products to start building your order.
        </p>

        <Link
          to="/products"
          className="mt-6 rounded-xl bg-white px-5 py-3 font-medium text-neutral-950 hover:bg-neutral-200"
        >
          Browse products
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro
            </p>

            <h1 className="mt-2 text-4xl font-bold">Shopping Cart</h1>
          </div>

          <Link
            to="/products"
            className="rounded-xl border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
          >
            Continue shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <div className="h-28 w-24 overflow-hidden rounded-xl bg-neutral-800">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm text-neutral-400">
                      {item.product.categoryName}
                    </p>

                    <h2 className="text-lg font-semibold">
                      {item.product.name}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-400">
                      {item.product.color} · {item.product.size}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="rounded-lg bg-neutral-800 px-3 py-1 hover:bg-neutral-700"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="rounded-lg bg-neutral-800 px-3 py-1 hover:bg-neutral-700"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right font-semibold">
                  {(item.product.price * item.quantity).toFixed(2)} lei
                </div>
              </div>
            ))}
          </section>

          <aside className="h-fit rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Order summary</h2>

            <div className="mt-6 space-y-3 text-sm text-neutral-300">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{totalPrice.toFixed(2)} lei</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Calculated later</span>
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-800 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} lei</span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-xl bg-white px-4 py-3 font-semibold text-neutral-950 hover:bg-neutral-200">
              Proceed to checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CartPage