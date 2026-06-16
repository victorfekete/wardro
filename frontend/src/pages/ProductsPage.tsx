import { useEffect, useState } from "react"
import { getCategories } from "../api/categoryApi"
import { getProducts } from "../api/productApi"
import ProductCard from "../components/ProductCard"
import type { Category } from "../types/Category"
import type { Product } from "../types/Product"
import Navbar from "../components/Navbar"
import LoadingState from "../components/LoadingState"
import ErrorState from "../components/ErrorState"

type FilterState = {
  search: string
  categoryId: string
  color: string
  size: string
  minPrice: string
  maxPrice: string
  sortBy: string
  sortDirection: string
}

const initialFilters: FilterState = {
  search: "",
  categoryId: "",
  color: "",
  size: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "id",
  sortDirection: "asc",
}



function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    try {
      setLoading(true)

      const [productsData, categoriesData] = await Promise.all([
        getProducts({
          page: 0,
          pageSize,
          sortBy: filters.sortBy,
          sortDirection: filters.sortDirection,
        }),
        getCategories(),
      ])

      setProducts(productsData.content)
      setTotalPages(productsData.totalPages)
      setCurrentPage(productsData.pageNumber)
      setCategories(categoriesData)
    } catch {
      setError("Could not load products.")
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  async function handleApplyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setFiltering(true)
      setError(null)

      const productsData = await getProducts({
        ...filters,
        page: 0,
        pageSize,
      })

      setProducts(productsData.content)
      setTotalPages(productsData.totalPages)
      setCurrentPage(productsData.pageNumber)
    } catch {
      setError("Could not apply filters.")
    } finally {
      setFiltering(false)
    }
  }

  async function handleResetFilters() {
    try {
      setFiltering(true)
      setError(null)
      setFilters(initialFilters)

      const productsData = await getProducts({
        ...initialFilters,
        page: 0,
        pageSize,
      })

      setProducts(productsData.content)
      setTotalPages(productsData.totalPages)
      setCurrentPage(productsData.pageNumber)
    } catch {
      setError("Could not reset filters.")
    } finally {
      setFiltering(false)
    }
  }

    async function handlePageChange(nextPage: number) {
      if (nextPage < 0 || nextPage >= totalPages) {
        return
      }

      try {
        setFiltering(true)
        setError(null)

        const productsData = await getProducts({
          ...filters,
          page: nextPage,
          pageSize,
        })

        setProducts(productsData.content)
        setTotalPages(productsData.totalPages)
        setCurrentPage(productsData.pageNumber)

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      } catch {
        setError("Could not load page.")
      } finally {
        setFiltering(false)
      }
    }


  if (loading) {
    return <LoadingState message="Loading products..." />
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load products"
        message={error}
        linkTo="/"
        linkLabel="Go home"
      />
    )
  }

  return (
      <>
      <Navbar />
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Discover your next outfit
            </h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              Browse curated fashion pieces, filter by style and build outfits
              that match your look.
            </p>
          </div>


        </div>

        <form
          onSubmit={handleApplyFilters}
          className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm text-neutral-400">Search</label>
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="hoodie, jeans..."
                className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400">Category</label>
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
              >
                <option value="">All categories</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-neutral-400">Color</label>
              <input
                name="color"
                value={filters.color}
                onChange={handleFilterChange}
                placeholder="Black"
                className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400">Size</label>
              <input
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                placeholder="M"
                className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400">Min price</label>
              <input
                name="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="100"
                className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400">Max price</label>
              <input
                name="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="300"
                className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400">Sort by</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
              >
                <option value="id">Newest</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="stock">Stock</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-neutral-400">Direction</label>
              <select
                name="sortDirection"
                value={filters.sortDirection}
                onChange={handleFilterChange}
                className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={filtering}
              className="rounded-xl bg-white px-5 py-2 font-medium text-neutral-950 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {filtering ? "Applying..." : "Apply filters"}
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              disabled={filtering}
              className="rounded-xl border border-neutral-700 px-5 py-2 font-medium text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mb-4 text-sm text-neutral-500">
          Showing {products.length} product{products.length === 1 ? "" : "s"}
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-neutral-400">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
    {totalPages > 1 && (
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:flex-row">
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0 || filtering}
          className="rounded-xl border border-neutral-700 px-5 py-2 font-medium text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <p className="text-sm text-neutral-400">
          Page{" "}
          <span className="font-medium text-white">{currentPage + 1}</span>{" "}
          of{" "}
          <span className="font-medium text-white">{totalPages}</span>
        </p>

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 >= totalPages || filtering}
          className="rounded-xl border border-neutral-700 px-5 py-2 font-medium text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}
      </div>
    </main>
    </>
  )
}

export default ProductsPage