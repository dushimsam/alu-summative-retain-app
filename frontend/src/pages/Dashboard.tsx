import { useEffect, useState } from 'react'
import { api } from '../api'
import type { DashboardSummary } from '../types'
import { Card, Input, Spinner } from '../components/ui'
import { currentMonth, formatDate, formatMoney } from '../utils'

const statusLabels: Record<string, { text: string; className: string }> = {
  within: { text: 'Within budget', className: 'bg-green-100 text-green-700' },
  approaching: {
    text: 'Approaching limit',
    className: 'bg-yellow-100 text-yellow-700',
  },
  over: { text: 'Over budget', className: 'bg-red-100 text-red-700' },
  'no-budget': { text: 'No budget set', className: 'bg-gray-100 text-gray-600' },
}

export function Dashboard() {
  const [month, setMonth] = useState(currentMonth())
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get<DashboardSummary>(`/dashboard?month=${month}`)
      .then(setData)
      .finally(() => setLoading(false))
  }, [month])

  const status = data ? statusLabels[data.status] : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="max-w-[180px]"
        />
      </div>

      {loading || !data ? (
        <Spinner />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-sm text-gray-500">Total spent</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {formatMoney(data.totalSpent)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Monthly budget</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {formatMoney(data.budget)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {formatMoney(data.remaining)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Status</p>
              {status && (
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                >
                  {status.text}
                </span>
              )}
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 font-semibold">Spending by category</h2>
              {data.spendingByCategory.length === 0 ? (
                <p className="text-sm text-gray-500">No spending yet.</p>
              ) : (
                <ul className="space-y-3">
                  {data.spendingByCategory.map((row) => (
                    <li key={row.category}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{row.category}</span>
                        <span className="font-medium">
                          {formatMoney(row.total)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{
                            width: `${
                              data.totalSpent > 0
                                ? (row.total / data.totalSpent) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {data.highestExpense && (
                <div className="mt-5 border-t border-gray-100 pt-4 text-sm">
                  <span className="text-gray-500">Highest expense: </span>
                  <span className="font-medium">
                    {data.highestExpense.title} —{' '}
                    {formatMoney(data.highestExpense.amount)}
                  </span>
                </div>
              )}
            </Card>

            <Card>
              <h2 className="mb-4 font-semibold">Recent expenses</h2>
              {data.recentExpenses.length === 0 ? (
                <p className="text-sm text-gray-500">No expenses yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.recentExpenses.map((expense) => (
                    <li
                      key={expense.id}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium">{expense.title}</p>
                        <p className="text-gray-500">
                          {formatDate(expense.spentOn)} ·{' '}
                          {expense.category?.name ?? 'Uncategorized'}
                        </p>
                      </div>
                      <span className="font-medium">
                        {formatMoney(expense.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
