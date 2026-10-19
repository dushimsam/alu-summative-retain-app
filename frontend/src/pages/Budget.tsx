import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Budget as BudgetType, DashboardSummary } from '../types'
import { Button, Card, Field, Input, Spinner } from '../components/ui'
import { currentMonth, formatMoney } from '../utils'

export function Budget() {
  const [month, setMonth] = useState(currentMonth())
  const [amount, setAmount] = useState('')
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  function load(selected: string) {
    setLoading(true)
    Promise.all([
      api.get<BudgetType>(`/budgets?month=${selected}`),
      api.get<DashboardSummary>(`/dashboard?month=${selected}`),
    ])
      .then(([budget, dash]) => {
        setAmount(budget.amount != null ? String(budget.amount) : '')
        setSummary(dash)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(month)
  }, [month])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await api.put('/budgets', { month, amount: Number(amount) })
      setMessage('Budget saved.')
      load(month)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Monthly budget</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Month">
              <Input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </Field>
            <Field label="Budget amount (USD)">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Field>
            {message && <p className="text-sm text-green-600">{message}</p>}
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save budget'}
            </Button>
          </form>
        </Card>

        <Card>
          {loading || !summary ? (
            <Spinner />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Spent this month</span>
                <span className="font-medium">
                  {formatMoney(summary.totalSpent)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Budget</span>
                <span className="font-medium">{formatMoney(summary.budget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Remaining</span>
                <span className="font-medium">
                  {formatMoney(summary.remaining)}
                </span>
              </div>

              {summary.budget != null && (
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-3 rounded-full ${
                      summary.status === 'over'
                        ? 'bg-red-500'
                        : summary.status === 'approaching'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        summary.budget > 0
                          ? (summary.totalSpent / summary.budget) * 100
                          : 0,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
