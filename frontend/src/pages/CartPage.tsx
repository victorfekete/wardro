import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import type { CartItem } from "../types/CartItem"
import { createOrder } from "../api/orderApi"
import { clearCart } from "../utils/cartStorage"
import {
  getCartItems,
  removeProductFromCart,
  updateCartItemQuantity,
} from "../utils/cartStorage"
import { isAuthenticated } from "../utils/authStorage"
import Navbar from "../components/Navbar"
import { getProductById } from "../api/productApi"
import LoadingState from "../components/LoadingState"


function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
   const [checkoutLoading, setCheckoutLoading] = useState(false)
   const [checkoutError, setCheckoutError] = useState<string | null>(null)
   const navigate = useNavigate()

   const [deliveryForm, setDeliveryForm] = useState({
     fullName: "",
     phone: "",
     address: "",
     city: "",
     postalCode: "",
     notes: "",
   })

  useEffect(() => {
    setCartItems(getCartItems())
  }, [])

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

   const totalItems = cartItems.reduce(
     (total, item) => total + item.quantity,
     0
   )

    const hasUnavailableItems = cartItems.some(
      (item) => item.product.active === false || item.product.stock === 0
    )

  function handleRemove(productId: number) {
    removeProductFromCart(productId)
    setCartItems(getCartItems())
  }

  function handleQuantityChange(productId: number, quantity: number) {
    const cartItem = cartItems.find((item) => item.product.id === productId)

    if (!cartItem) {
      return
    }

    if (quantity < 1) {
      removeProductFromCart(productId)
      setCartItems(getCartItems())
      return
    }

    if (quantity > cartItem.product.stock) {
      return
    }

    updateCartItemQuantity(productId, quantity)
    setCartItems(getCartItems())
  }

    function handleDeliveryInputChange(
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
      const { name, value } = event.target

      setDeliveryForm((currentForm) => ({
        ...currentForm,
        [name]: value,
      }))
    }

   async function handleCheckout() {
     if (cartItems.length === 0) {
       return
     }

     if (!isAuthenticated()) {
         navigate("/login")
         return
     }

    if (
      !deliveryForm.fullName.trim() ||
      !deliveryForm.phone.trim() ||
      !deliveryForm.address.trim() ||
      !deliveryForm.city.trim() ||
      !deliveryForm.postalCode.trim()
    ) {
      setCheckoutError("Please complete the delivery details.")
      return
    }

     setCheckoutLoading(true)
     setCheckoutError(null)



     try {
       const latestProducts = await Promise.all(
         cartItems.map((item) => getProductById(String(item.product.id)))
       )

       const unavailableProduct = latestProducts.find(
         (product) => product.active === false || product.stock === 0
       )

       if (unavailableProduct) {
         setCheckoutError(
           `${unavailableProduct.name} is no longer available. Please remove it from your cart.`
         )
         return
       }

       const productWithNotEnoughStock = latestProducts.find((product) => {
         const cartItem = cartItems.find((item) => item.product.id === product.id)

         if (!cartItem) {
           return false
         }

         return cartItem.quantity > product.stock
       })

       if (productWithNotEnoughStock) {
         setCheckoutError(
           `Not enough stock for ${productWithNotEnoughStock.name}. Please update your cart.`
         )
         return
       }

       const orderRequest = {
         deliveryFullName: deliveryForm.fullName,
         deliveryPhone: deliveryForm.phone,
         deliveryAddress: deliveryForm.address,
         deliveryCity: deliveryForm.city,
         deliveryPostalCode: deliveryForm.postalCode,
         deliveryNotes: deliveryForm.notes,
         items: cartItems.map((item) => ({
           productId: item.product.id,
           quantity: item.quantity,
         })),
       }

       const createdOrder = await createOrder(orderRequest)
       clearCart()
       setCartItems([])

       navigate(`/orders/${createdOrder.id}`)
     } catch {
       setCheckoutError("Could not create order. Please try again.")
     } finally {
       setCheckoutLoading(false)
     }
   }

  if (cartItems.length === 0) {
    return (
        <>
        <Navbar />
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
      </>
    )
  }

  return (
      <>
      <Navbar />
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
                    src={item.product.imageUrl || "/icons.svg"}
                    alt={item.product.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = "/icons.svg"
                    }}
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

                    {item.product.active === false && (
                      <p className="mt-2 text-sm text-red-400">
                        This product is no longer available.
                      </p>
                    )}

                    {item.product.stock === 0 && (
                      <p className="mt-2 text-sm text-red-400">
                        This product is out of stock.
                      </p>
                    )}
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
                        disabled={item.quantity >= item.product.stock}
                        className="rounded-lg bg-neutral-800 px-3 py-1 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="text-xl font-semibold">Delivery details</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-neutral-400">Full name</label>
                  <input
                    name="fullName"
                    value={deliveryForm.fullName}
                    onChange={handleDeliveryInputChange}
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-400">Phone</label>
                  <input
                    name="phone"
                    value={deliveryForm.phone}
                    onChange={handleDeliveryInputChange}
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-neutral-400">Address</label>
                  <input
                    name="address"
                    value={deliveryForm.address}
                    onChange={handleDeliveryInputChange}
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-400">City</label>
                  <input
                    name="city"
                    value={deliveryForm.city}
                    onChange={handleDeliveryInputChange}
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-400">Postal code</label>
                  <input
                    name="postalCode"
                    value={deliveryForm.postalCode}
                    onChange={handleDeliveryInputChange}
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-neutral-400">Notes</label>
                  <textarea
                    name="notes"
                    value={deliveryForm.notes}
                    onChange={handleDeliveryInputChange}
                    rows={3}
                    placeholder="Optional delivery notes"
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Order summary</h2>

            <div className="mt-6 space-y-3 text-sm text-neutral-300">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{totalItems}</span>
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

            {checkoutError && (
              <p className="mt-4 text-sm text-red-400">{checkoutError}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || hasUnavailableItems}
              className="mt-6 w-full rounded-xl bg-white px-4 py-3 font-semibold text-neutral-950 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading
                ? "Creating order..."
                : hasUnavailableItems
                  ? "Unavailable items in cart"
                  : "Proceed to checkout"}
            </button>
          </aside>
        </div>
      </div>
    </main>
    </>
  )
}

export default CartPage