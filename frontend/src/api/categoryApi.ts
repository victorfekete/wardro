import type { Category } from "../types/Category"
import { getAuthToken } from "../utils/authStorage"

const API_URL = "http://localhost:8080/api"

export type CategoryRequest = {
  name: string
  description: string
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`)

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  return response.json()
}

export async function getAdminCategories(): Promise<Category[]> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/categories/admin`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch admin categories")
  }

  return response.json()
}

export async function createCategory(
  categoryRequest: CategoryRequest
): Promise<Category> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(categoryRequest),
  })

  if (!response.ok) {
    throw new Error("Failed to create category")
  }

  return response.json()
}

export async function updateCategory(
  categoryId: number,
  categoryRequest: CategoryRequest
): Promise<Category> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(categoryRequest),
  })

  if (!response.ok) {
    throw new Error("Failed to update category")
  }

  return response.json()
}

export async function deleteCategory(categoryId: number): Promise<void> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to deactivate category")
  }
}

export async function reactivateCategory(categoryId: number): Promise<Category> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/categories/${categoryId}/reactivate`, {
    method: "PUT",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to reactivate category")
  }

  return response.json()
}