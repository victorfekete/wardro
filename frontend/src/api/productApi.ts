import type { ProductPage } from "../types/ProductPage"

const API_URL = "http://localhost:8080/api"

export async function getProducts(): Promise<ProductPage> {
  const response = await fetch(
    `${API_URL}/products?page=0&pageSize=10&sortBy=id&sortDirection=asc`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}