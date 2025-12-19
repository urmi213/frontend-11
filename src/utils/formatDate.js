/**
 * Format date to display format
 * @param {Date|string} date - Date to format
 * @param {string} format - Output format
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'display') => {
  const dateObj = new Date(date)
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }

  const formats = {
    display: {
      date: dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      datetime: `${dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })} at ${dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    },
    short: dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    numeric: dateObj.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }),
    time: dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    relative: getRelativeTime(dateObj),
    iso: dateObj.toISOString(),
    database: dateObj.toISOString().split('T')[0]
  }

  return formats[format] || formats.display.date
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param {Date} date - Date to compare
 * @returns {string} Relative time string
 */
const getRelativeTime = (date) => {
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) {
    return 'just now'
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`
  } else {
    return formatDate(date, 'short')
  }
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: BDT)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'BDT') => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format blood group with icon
 * @param {string} bloodGroup - Blood group string
 * @returns {string} Formatted blood group with icon
 */
export const formatBloodGroup = (bloodGroup) => {
  if (!bloodGroup) return ''
  
  const colors = {
    'A+': 'text-red-600 bg-red-100',
    'A-': 'text-red-600 bg-red-50',
    'B+': 'text-blue-600 bg-blue-100',
    'B-': 'text-blue-600 bg-blue-50',
    'AB+': 'text-purple-600 bg-purple-100',
    'AB-': 'text-purple-600 bg-purple-50',
    'O+': 'text-green-600 bg-green-100',
    'O-': 'text-green-600 bg-green-50'
  }

  const colorClass = colors[bloodGroup] || 'text-gray-600 bg-gray-100'
  
  return `<span class="badge ${colorClass} border-0">${bloodGroup}</span>`
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default {
  formatDate,
  formatCurrency,
  formatBloodGroup,
  truncateText,
  formatFileSize
}