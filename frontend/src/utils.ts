export function formatMoney(value: number | null | undefined) {
  if (value == null) {
    return '-'
  }
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

export function formatDate(value: string) {
  // Values come from the API as YYYY-MM-DD.
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}
