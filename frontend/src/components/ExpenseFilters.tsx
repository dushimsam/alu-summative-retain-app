import type { Category } from '../types'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { resetFilters, setFilter, setSort } from '../store/filtersSlice'
import type { FiltersState } from '../store/filtersSlice'
import { paymentMethods } from '../constants'
import { Button, Input, Select } from './ui'

export function ExpenseFilters({ categories }: { categories: Category[] }) {
  const filters = useAppSelector((state) => state.filters)
  const dispatch = useAppDispatch()

  function update(key: keyof FiltersState, value: string) {
    dispatch(setFilter({ key, value }))
  }

  const sortValue = `${filters.sortBy}-${filters.order}`

  return (
    <div className="space-y-3 rounded-lg border border-transparent bg-white p-4 shadow-card">
      <Input
        placeholder="Search by title or notes"
        value={filters.search}
        onChange={(e) => update('search', e.target.value)}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          value={filters.category}
          onChange={(e) => update('category', e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <Select
          value={filters.paymentMethod}
          onChange={(e) => update('paymentMethod', e.target.value)}
        >
          <option value="">All payment methods</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </Select>

        <Select
          value={sortValue}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-')
            dispatch(
              setSort({
                sortBy: sortBy as 'date' | 'amount',
                order: order as 'asc' | 'desc',
              }),
            )
          }}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Amount: high to low</option>
          <option value="amount-asc">Amount: low to high</option>
        </Select>

        <Button variant="secondary" onClick={() => dispatch(resetFilters())}>
          Clear filters
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm text-gray-600">
          From
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => update('startDate', e.target.value)}
          />
        </label>
        <label className="text-sm text-gray-600">
          To
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => update('endDate', e.target.value)}
          />
        </label>
        <label className="text-sm text-gray-600">
          Min amount
          <Input
            type="number"
            min="0"
            value={filters.minAmount}
            onChange={(e) => update('minAmount', e.target.value)}
          />
        </label>
        <label className="text-sm text-gray-600">
          Max amount
          <Input
            type="number"
            min="0"
            value={filters.maxAmount}
            onChange={(e) => update('maxAmount', e.target.value)}
          />
        </label>
      </div>
    </div>
  )
}
