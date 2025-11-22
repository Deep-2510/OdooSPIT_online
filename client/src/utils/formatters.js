import { format } from 'date-fns'

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  if (!date) return '-'
  return format(new Date(date), formatString)
}

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM d, yyyy HH:mm')
}

export const formatStockQuantity = (quantity, uom = '') => {
  return `${quantity.toLocaleString()} ${uom}`.trim()
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}