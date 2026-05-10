import type { OrderRequest, OrderResponse } from "../types/Order"

const API_URL = "http://localhost:8080/api"

export async function createOrder(
  orderRequest: OrderRequest
): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderRequest),
  })

  if (!response.ok) {
    throw new Error("Failed to create order")
  }

  return response.json()
}

export async function getOrderById(id: string): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/orders/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch order")
  }

  return response.json()
}

export async function getOrders(): Promise<OrderResponse[]> {
  const response = await fetch(`${API_URL}/orders`)

  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }

  return response.json()
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderResponse["status"]
): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/orders/${orderId}/status?status=${status}`, {
    method: "PUT",
  })

  if (!response.ok) {
    throw new Error("Failed to update order status")
  }

  return response.json()
}