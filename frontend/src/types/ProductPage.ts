import type { Product } from "./Product"

export type ProductPage = {
  content: Product[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}