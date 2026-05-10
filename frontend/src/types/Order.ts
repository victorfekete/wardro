export type OrderItemRequest = {
  productId: number
  quantity: number
}

export type OrderRequest = {
  items: OrderItemRequest[]
}

export type OrderItemResponse = {
  productId: number
  productName: string
  quantity: number
  priceAtPurchase: number
  subtotal: number
}

export type OrderResponse = {
  id: number
  totalPrice: number
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  createdAt: string
  items: OrderItemResponse[]
}