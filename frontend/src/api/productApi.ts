import type { Product } from "../types/Product"
import type { ProductPage } from "../types/ProductPage"

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

export async function getProducts(): Promise<ProductPage> {
  const response = await fetch(
    `${API_URL}/products?page=0&pageSize=50&sortBy=id&sortDirection=asc`
  )

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
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productRequest),
  })

  if (!response.ok) {
    throw new Error("Failed to update product")
  }

  return response.json()
}

export async function deleteProduct(productId: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete product")
  }
}