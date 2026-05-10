import type { CartItem } from "../types/CartItem"
import type { Product } from "../types/Product"

const CART_KEY = "wardro_cart"

export function getCartItems(): CartItem[] {
  const storedCart = localStorage.getItem(CART_KEY)

  if (!storedCart) {
    return []
  }

  try {
    return JSON.parse(storedCart)
  } catch {
    return []
  }
}

export function saveCartItems(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addProductToCart(product: Product) {
  const cartItems = getCartItems()

  const existingItem = cartItems.find(
    (item) => item.product.id === product.id
  )

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cartItems.push({
      product,
      quantity: 1,
    })
  }

  saveCartItems(cartItems)
}

export function removeProductFromCart(productId: number) {
  const cartItems = getCartItems().filter(
    (item) => item.product.id !== productId
  )

  saveCartItems(cartItems)
}

export function updateCartItemQuantity(productId: number, quantity: number) {
  const cartItems = getCartItems()

  const updatedItems = cartItems
    .map((item) => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity,
        }
      }

      return item
    })
    .filter((item) => item.quantity > 0)

  saveCartItems(updatedItems)
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
}