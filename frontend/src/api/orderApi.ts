import type { OrderRequest, OrderResponse } from "../types/Order"
import { getAuthToken } from "../utils/authStorage"

const API_URL = "http://localhost:8080/api"

export async function createOrder(
  orderRequest: OrderRequest
): Promise<OrderResponse> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(orderRequest),
  })

  if (!response.ok) {
    throw new Error("Failed to create order")
  }

  return response.json()
}

export async function getOrderById(id: string): Promise<OrderResponse> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch order")
  }

  return response.json()
}

export async function getOrders(): Promise<OrderResponse[]> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }

  return response.json()
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderResponse["status"]
): Promise<OrderResponse> {
  const token = getAuthToken()

  const response = await fetch(
    `${API_URL}/orders/${orderId}/status?status=${status}`,
    {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update order status")
  }

  return response.json()
}