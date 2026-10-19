import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { api } from '../api'
import type { Category, Expense, Paginated } from '../types'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setPage } from '../store/filtersSlice'
import { ExpenseFilters } from '../components/ExpenseFilters'
import { ExpenseForm } from '../components/ExpenseForm'
import { Button, Card, Spinner } from '../components/ui'
import { formatDate, formatMoney } from '../utils'

const PAGE_SIZE = 10

export function Expenses() {
  const filters = useAppSelector((state) => state.filters)
  const dispatch = useAppDispatch()

  const [categories, setCategories] = useState<Category[]>([])
  const [result, setResult] = useState<Paginated<Expense> | null>(null)
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories)
  }, [])

  const load = useCallback(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.paymentMethod) params.set('paymentMethod', filters.paymentMethod)
    if (filters.startDate) params.set('startDate', filters.startDate)
    if (filters.endDate) params.set('endDate', filters.endDate)
    if (filters.minAmount) params.set('minAmount', filters.minAmount)
    if (filters.maxAmount) params.set('maxAmount', filters.maxAmount)
    params.set('sortBy', filters.sortBy)
    params.set('order', filters.order)
    params.set('page', String(filters.page))
    params.set('limit', String(PAGE_SIZE))

    setLoading(true)
    api
      .get<Paginated<Expense>>(`/expenses?${params.toString()}`)
      .then(setResult)
      .finally(() => setLoading(false))
  }, [filters])

  // Debounce so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(load, 300)
    return () => clearTimeout(timer)
  }, [load])

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(expense: Expense) {
    setEditing(expense)
    setFormOpen(true)
  }

  async function handleDelete(expense: Expense) {
    if (!confirm(`Delete "${expense.title}"?`)) {
      return
    }
    await api.del(`/expenses/${expense.id}`)
    load()
  }

  function handleSaved() {
    setFormOpen(false)
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <Button onClick={openAdd}>Add expense</Button>
      </div>

      <ExpenseFilters categories={categories} />

      {loading || !result ? (
        <Spinner />
      ) : result.data.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500">No expenses match your filters.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.data.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{expense.title}</p>
                    {expense.notes && (
                      <p className="text-xs text-gray-400">{expense.notes}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {expense.category?.name ?? 'Uncategorized'}
                  </td>
                  <td className="px-4 py-3">{formatDate(expense.spentOn)}</td>
                  <td className="px-4 py-3">{expense.paymentMethod}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatMoney(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-indigo-600 hover:underline"
                        onClick={() => openEdit(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(expense)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {result && result.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Page {result.page} of {result.totalPages} · {result.total} total
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={result.page <= 1}
              onClick={() => dispatch(setPage(result.page - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={result.page >= result.totalPages}
              onClick={() => dispatch(setPage(result.page + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <ExpenseForm
            key="expense-form"
            categories={categories}
            expense={editing}
            onClose={() => setFormOpen(false)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
