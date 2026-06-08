import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/productApi"
import { getCategories } from "../api/categoryApi"
import type { Product } from "../types/Product"
import type { Category } from "../types/Category"
import { isAdmin } from "../utils/authStorage"

type ProductFormState = {
  name: string
  description: string
  price: string
  brand: string
  color: string
  size: string
  stock: string
  imageUrl: string
  categoryId: string
}

const initialFormState: ProductFormState = {
  name: "",
  description: "",
  price: "",
  brand: "",
  color: "",
  size: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
}



function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductFormState>(initialFormState)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)

      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ])

      setProducts(productsData.content)
      setCategories(categoriesData)
    } catch {
      setError("Could not load admin products data.")
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmitProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.categoryId) {
      setError("Please select a category.")
      return
    }

    try {
      setSaving(true)
      setError(null)

      const productRequest = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        brand: form.brand,
        color: form.color,
        size: form.size,
        stock: Number(form.stock),
        imageUrl: form.imageUrl,
        categoryId: Number(form.categoryId),
      }

      if (editingProductId) {
        const updatedProduct = await updateProduct(editingProductId, productRequest)

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingProductId ? updatedProduct : product
          )
        )

        setEditingProductId(null)
      } else {
        const createdProduct = await createProduct(productRequest)

        setProducts((currentProducts) => [...currentProducts, createdProduct])
      }

      setForm(initialFormState)
    } catch {
      setError(
        editingProductId
          ? "Could not update product."
          : "Could not create product."
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteProduct(productId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this product?")

    if (!confirmed) {
      return
    }

    try {
      await deleteProduct(productId)

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      )
    } catch {
      setError("Could not delete product.")
    }
  }

    function handleEditProduct(product: Product) {
      setEditingProductId(product.id)

      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        brand: product.brand,
        color: product.color,
        size: product.size,
        stock: String(product.stock),
        imageUrl: product.imageUrl,
        categoryId: String(product.categoryId),
      })

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }

    function handleCancelEdit() {
      setEditingProductId(null)
      setForm(initialFormState)
    }

  if (!isAdmin()) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-white">
        <h1 className="text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-neutral-400">
          You need an admin account to access this page.
        </p>
        <Link
          to="/login"
          className="mt-6 rounded-xl bg-white px-5 py-3 font-medium text-neutral-950 hover:bg-neutral-200"
        >
          Login as admin
        </Link>
      </main>
    )
  }


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        Loading admin products...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold">Products</h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              Add, view and remove products from the Wardro store.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin/orders"
              className="rounded-xl border border-neutral-800 px-4 py-2 font-medium text-neutral-300 hover:bg-neutral-900"
            >
              Orders
            </Link>

            <Link
              to="/products"
              className="rounded-xl bg-white px-4 py-2 font-medium text-neutral-950 hover:bg-neutral-200"
            >
              Storefront
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="h-fit rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">
              {editingProductId ? "Edit product" : "Add product"}
            </h2>

                <form onSubmit={handleSubmitProduct} className="mt-6 space-y-4">              <div>
                <label className="text-sm text-neutral-400">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-neutral-400">Price</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-400">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-neutral-400">Brand</label>
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-400">Color</label>
                  <input
                    name="color"
                    value={form.color}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-neutral-400">Size</label>
                  <input
                    name="size"
                    value={form.size}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-400">Category</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                  >
                    <option value="">Select</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-400">Image URL</label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://placehold.co/600x800?text=Wardro"
                  className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-neutral-950 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingProductId
                    ? "Update product"
                    : "Add product"}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full rounded-xl border border-neutral-700 px-4 py-3 font-semibold text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel edit
                </button>
              )}
            </form>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Current products</h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400">
                    <th className="py-3 pr-4">Product</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Price</th>
                    <th className="py-3 pr-4">Size</th>
                    <th className="py-3 pr-4">Stock</th>
                    <th className="py-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-800 last:border-b-0"
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-12 overflow-hidden rounded-lg bg-neutral-800">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-white">
                              {product.name}
                            </p>
                            <p className="text-neutral-500">{product.brand}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-neutral-300">
                        {product.categoryName}
                      </td>

                      <td className="py-4 pr-4 text-neutral-300">
                        {product.price.toFixed(2)} lei
                      </td>

                      <td className="py-4 pr-4 text-neutral-300">
                        {product.size}
                      </td>

                      <td className="py-4 pr-4 text-neutral-300">
                        {product.stock}
                      </td>

                      <td className="py-4 pr-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-neutral-300 hover:text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <p className="mt-6 text-neutral-400">No products found.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}



export default AdminProductsPage