import type { Product } from "../types/Product"
import type { ProductPage } from "../types/ProductPage"
import { getAuthToken } from "../utils/authStorage"

const API_URL = "http://localhost:8080/api"

export type CreateProductRequest = {
  name: string
  description: string
  price: number
  brand: string
  color: string
  size: string
  stock: number
  imageUrl: string
  categoryId: number
}

export type ProductFilters = {
  search?: string
  categoryId?: string
  color?: string
  size?: string
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  sortDirection?: string
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductPage> {
  const params = new URLSearchParams()

  params.set("page", "0")
  params.set("pageSize", "50")

  if (filters.search) {
    params.set("search", filters.search)
  }

  if (filters.categoryId) {
    params.set("categoryId", filters.categoryId)
  }

  if (filters.color) {
    params.set("color", filters.color)
  }

  if (filters.size) {
    params.set("size", filters.size)
  }

  if (filters.minPrice) {
    params.set("minPrice", filters.minPrice)
  }

  if (filters.maxPrice) {
    params.set("maxPrice", filters.maxPrice)
  }

  params.set("sortBy", filters.sortBy || "id")
  params.set("sortDirection", filters.sortDirection || "asc")

  const response = await fetch(`${API_URL}/products?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch product")
  }

  return response.json()
}

export async function createProduct(
  productRequest: CreateProductRequest
): Promise<Product> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(productRequest),
  })

  if (!response.ok) {
    throw new Error("Failed to create product")
  }

  return response.json()
}

export async function updateProduct(
  productId: number,
  productRequest: CreateProductRequest
): Promise<Product> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(productRequest),
  })

  if (!response.ok) {
    throw new Error("Failed to update product")
  }

  return response.json()
}

export async function deleteProduct(productId: number): Promise<void> {
  const token = getAuthToken()

  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete product")
  }
}