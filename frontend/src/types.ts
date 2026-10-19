export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface Category {
  id: number
  name: string
  isDefault: boolean
  createdAt: string
}

export interface Expense {
  id: number
  userId: number
  title: string
  amount: number
  categoryId: number | null
  spentOn: string
  paymentMethod: string
  notes: string | null
  createdAt: string
  updatedAt: string
  category: Category | null
}

export interface Paginated<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Budget {
  id?: number
  month: string
  amount: number | null
}

export interface CategoryTotal {
  category: string
  total: number
}

export interface DashboardSummary {
  month: string
  totalSpent: number
  budget: number | null
  remaining: number | null
  status: 'within' | 'approaching' | 'over' | 'no-budget'
  highestExpense: Expense | null
  spendingByCategory: CategoryTotal[]
  recentExpenses: Expense[]
}

export interface CategoryUsage {
  id: number
  name: string
  uses: number
}

export interface AdminInsights {
  totalUsers: number
  totalExpenses: number
  totalExpenseValue: number
  expensesThisMonth: number
  spendingPerCategory: CategoryTotal[]
  topCategories: CategoryUsage[]
  bottomCategories: CategoryUsage[]
  recentExpenses: (Expense & { user: { id: number; name: string } | null })[]
  recentUsers: (User & { createdAt: string })[]
}
