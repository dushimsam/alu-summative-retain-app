import { useState } from 'react'
import { api } from '../api'
import type { Category, Expense } from '../types'
import { paymentMethods } from '../constants'
import { Button, Field, Input, Select, Textarea } from './ui'
import { Modal } from './Modal'
import { currentMonth } from '../utils'

interface Props {
  categories: Category[]
  expense: Expense | null
  onClose: () => void
  onSaved: () => void
}

export function ExpenseForm({ categories, expense, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(expense?.title ?? '')
  const [amount, setAmount] = useState(expense ? String(expense.amount) : '')
  const [categoryId, setCategoryId] = useState(
    expense?.categoryId ? String(expense.categoryId) : '',
  )
  const [spentOn, setSpentOn] = useState(
    expense?.spentOn ?? `${currentMonth()}-01`,
  )
  const [paymentMethod, setPaymentMethod] = useState(
    expense?.paymentMethod ?? paymentMethods[0],
  )
  const [notes, setNotes] = useState(expense?.notes ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const payload = {
      title,
      amount: Number(amount),
      categoryId: categoryId ? Number(categoryId) : null,
      spentOn,
      paymentMethod,
      notes: notes || null,
    }

    try {
      if (expense) {
        await api.put(`/expenses/${expense.id}`, payload)
      } else {
        await api.post('/expenses', payload)
      }
      onSaved()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={expense ? 'Edit expense' : 'Add expense'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Amount">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Field>
          <Field label="Date">
            <Input
              type="date"
              value={spentOn}
              onChange={(e) => setSpentOn(e.target.value)}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Payment method">
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Notes (optional)">
          <Textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
