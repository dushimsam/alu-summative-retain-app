export function formatMoney(value: number | null | undefined) {
  if (value == null) {
    return '-'
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
