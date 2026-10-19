import { useEffect, useState } from 'react'
import { api } from '../../api'
import type { AdminInsights } from '../../types'
import { Card, Spinner } from '../../components/ui'
import { formatDate, formatMoney } from '../../utils'

export function AdminDashboard() {
  const [data, setData] = useState<AdminInsights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<AdminInsights>('/admin/insights')
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return <Spinner />
  }

  const stats = [
    { label: 'Registered users', value: data.totalUsers },
    { label: 'Total expenses', value: data.totalExpenses },
    { label: 'Total value', value: formatMoney(data.totalExpenseValue) },
    { label: 'Expenses this month', value: data.expensesThisMonth },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Spending per category</h2>
          {data.spendingPerCategory.length === 0 ? (
            <p className="text-sm text-gray-500">No data yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.spendingPerCategory.map((row) => (
                <li key={row.category} className="flex justify-between">
                  <span>{row.category}</span>
                  <span className="font-medium">{formatMoney(row.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="grid gap-6">
          <Card>
            <h2 className="mb-3 font-semibold">Top 5 categories</h2>
            <ul className="space-y-1 text-sm">
              {data.topCategories.map((cat) => (
                <li key={cat.id} className="flex justify-between">
                  <span>{cat.name}</span>
                  <span className="text-gray-500">{cat.uses} uses</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="mb-3 font-semibold">Bottom 5 categories</h2>
            <ul className="space-y-1 text-sm">
              {data.bottomCategories.map((cat) => (
                <li key={cat.id} className="flex justify-between">
                  <span>{cat.name}</span>
                  <span className="text-gray-500">{cat.uses} uses</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Recently added expenses</h2>
          <ul className="divide-y divide-gray-100 text-sm">
            {data.recentExpenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="font-medium">{expense.title}</p>
                  <p className="text-gray-500">
                    {formatDate(expense.spentOn)} ·{' '}
                    {expense.user?.name ?? 'Unknown'}
                  </p>
                </div>
                <span className="font-medium">
                  {formatMoney(expense.amount)}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Recently registered users</h2>
          <ul className="divide-y divide-gray-100 text-sm">
            {data.recentUsers.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <span className="text-xs text-gray-400">{user.role}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
