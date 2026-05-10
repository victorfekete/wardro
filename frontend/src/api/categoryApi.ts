import type { Category } from "../types/Category"

const API_URL = "http://localhost:8080/api"

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`)

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  return response.json()
}