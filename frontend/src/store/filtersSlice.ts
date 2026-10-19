import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface FiltersState {
  search: string
  category: string
  paymentMethod: string
  startDate: string
  endDate: string
  minAmount: string
  maxAmount: string
  sortBy: 'date' | 'amount'
  order: 'asc' | 'desc'
  page: number
}

const initialState: FiltersState = {
  search: '',
  category: '',
  paymentMethod: '',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  sortBy: 'date',
  order: 'desc',
  page: 1,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Any filter change should send the user back to the first page.
    setFilter(
      state,
      action: PayloadAction<{ key: keyof FiltersState; value: string }>,
    ) {
      const { key, value } = action.payload
      ;(state as Record<string, unknown>)[key] = value
      state.page = 1
    },
    setSort(
      state,
      action: PayloadAction<{ sortBy: 'date' | 'amount'; order: 'asc' | 'desc' }>,
    ) {
      state.sortBy = action.payload.sortBy
      state.order = action.payload.order
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setFilter, setSort, setPage, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer
