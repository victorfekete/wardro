export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

export type OrderItemRequest = {
  productId: number
  quantity: number
}

export type OrderItemResponse = {
  productId: number
  productName: string
  quantity: number
  priceAtPurchase: number
  subtotal: number
}

export type CreateOrderRequest = {
  deliveryFullName: string
  deliveryPhone: string
  deliveryAddress: string
  deliveryCity: string
  deliveryPostalCode: string
  deliveryNotes: string
  items: OrderItemRequest[]
}

export type OrderResponse = {
  id: number
  totalPrice: number
  status: OrderStatus
  createdAt: string

  userId: number | null
  customerName: string | null
  customerEmail: string | null

  deliveryFullName: string | null
  deliveryPhone: string | null
  deliveryAddress: string | null
  deliveryCity: string | null
  deliveryPostalCode: string | null
  deliveryNotes: string | null

  items: OrderItemResponse[]
}

export type Order = OrderResponse