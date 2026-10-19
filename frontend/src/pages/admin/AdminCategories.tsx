import { useEffect, useState } from 'react'
import { api } from '../../api'
import type { Category } from '../../types'
import { Button, Card, Input, Spinner } from '../../components/ui'

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    api
      .get<Category[]>('/categories')
      .then(setCategories)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/categories', { name: newName })
      setNewName('')
      load()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function handleRename(id: number) {
    setError('')
    try {
      await api.put(`/categories/${id}`, { name: editingName })
      setEditingId(null)
      load()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function handleDelete(category: Category) {
    if (
      !confirm(
        `Delete "${category.name}"? Its expenses will move to Uncategorized.`,
      )
    ) {
      return
    }
    setError('')
    try {
      await api.del(`/categories/${category.id}`)
      load()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="mb-3 font-semibold">Add category</h2>
        <form onSubmit={handleCreate} className="flex gap-2">
          <Input
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Button type="submit">Add</Button>
        </form>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                {editingId === category.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleRename(category.id)}>
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      {category.name}
                      {category.isDefault && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          default
                        </span>
                      )}
                    </span>
                    {!category.isDefault && (
                      <div className="flex gap-3 text-sm">
                        <button
                          className="text-indigo-600 hover:underline"
                          onClick={() => {
                            setEditingId(category.id)
                            setEditingName(category.name)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(category)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
