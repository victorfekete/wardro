import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import type { Category } from "../types/Category"
import { isAdmin } from "../utils/authStorage"
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  reactivateCategory,
  updateCategory,
} from "../api/categoryApi"

type CategoryFormState = {
  name: string
  description: string
}

const initialFormState: CategoryFormState = {
  name: "",
  description: "",
}

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<CategoryFormState>(initialFormState)
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      setLoading(true)
      setError(null)

      const categoriesData = await getAdminCategories()

      setCategories(categoriesData)
    } catch {
      setError("Could not load categories.")
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmitCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSaving(true)
      setError(null)

      const categoryRequest = {
        name: form.name,
        description: form.description,
      }

      if (editingCategoryId) {
        const updatedCategory = await updateCategory(
          editingCategoryId,
          categoryRequest
        )

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === editingCategoryId ? updatedCategory : category
          )
        )

        setEditingCategoryId(null)
      } else {
        const createdCategory = await createCategory(categoryRequest)

        setCategories((currentCategories) => [
          ...currentCategories,
          createdCategory,
        ])
      }

      setForm(initialFormState)
    } catch {
      setError(
        editingCategoryId
          ? "Could not update category."
          : "Could not create category."
      )
    } finally {
      setSaving(false)
    }
  }

  function handleEditCategory(category: Category) {
    setEditingCategoryId(category.id)

    setForm({
      name: category.name,
      description: category.description,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  function handleCancelEdit() {
    setEditingCategoryId(null)
    setForm(initialFormState)
  }

  async function handleDeactivateCategory(categoryId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this category?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError(null)

      await deleteCategory(categoryId)

      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === categoryId
            ? { ...category, active: false }
            : category
        )
      )
    } catch {
      setError("Could not deactivate category.")
    }
  }

  async function handleReactivateCategory(categoryId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to reactivate this category?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError(null)

      const reactivatedCategory = await reactivateCategory(categoryId)

      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === categoryId ? reactivatedCategory : category
        )
      )
    } catch {
      setError("Could not reactivate category.")
    }
  }

  if (!isAdmin()) {
    return (
      <>
        <Navbar />

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
      </>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
          Loading categories...
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Wardro Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold">Categories</h1>

            <p className="mt-3 max-w-2xl text-neutral-400">
              Add, edit, deactivate and reactivate product categories.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <section className="h-fit rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="text-xl font-semibold">
                {editingCategoryId ? "Edit category" : "Add category"}
              </h2>

              <form onSubmit={handleSubmitCategory} className="mt-6 space-y-4">
                <div>
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
                  <label className="text-sm text-neutral-400">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={4}
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
                    : editingCategoryId
                      ? "Update category"
                      : "Add category"}
                </button>

                {editingCategoryId && (
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
              <h2 className="text-xl font-semibold">Current categories</h2>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400">
                      <th className="py-3 pr-4">Name</th>
                      <th className="py-3 pr-4">Description</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-neutral-800 last:border-b-0"
                      >
                        <td className="py-4 pr-4 font-medium text-white">
                          {category.name}
                        </td>

                        <td className="py-4 pr-4 text-neutral-300">
                          {category.description || "-"}
                        </td>

                        <td className="py-4 pr-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              category.active
                                ? "bg-green-950 text-green-300"
                                : "bg-red-950 text-red-300"
                            }`}
                          >
                            {category.active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="py-4 pr-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-neutral-300 hover:text-white"
                            >
                              Edit
                            </button>

                            {category.active ? (
                              <button
                                onClick={() =>
                                  handleDeactivateCategory(category.id)
                                }
                                className="text-yellow-400 hover:text-yellow-300"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleReactivateCategory(category.id)
                                }
                                className="text-green-400 hover:text-green-300"
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {categories.length === 0 && (
                  <p className="mt-6 text-neutral-400">
                    No categories found.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}

export default AdminCategoriesPage