/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Password validation
 * @param {string} password - Password to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false
  } = options

  const errors = []

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Blood group validation
 * @param {string} bloodGroup - Blood group to validate
 * @returns {boolean} True if valid
 */
export const validateBloodGroup = (bloodGroup) => {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  return validGroups.includes(bloodGroup)
}

/**
 * Phone number validation (Bangladesh)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const validatePhone = (phone) => {
  const re = /^(?:\+88|88)?(01[3-9]\d{8})$/
  return re.test(phone)
}

/**
 * URL validation
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export const validateURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Date validation (future date)
 * @param {string} date - Date string to validate
 * @returns {boolean} True if valid future date
 */
export const validateFutureDate = (date) => {
  const inputDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return inputDate >= today
}

/**
 * Time validation (HH:mm format)
 * @param {string} time - Time string to validate
 * @returns {boolean} True if valid
 */
export const validateTime = (time) => {
  const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return re.test(time)
}

/**
 * File validation
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 2 * 1024 * 1024, // 2MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  } = options

  const errors = []

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`)
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension must be one of: ${allowedExtensions.join(', ')}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Required field validation
 * @param {*} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value && value !== 0) {
    return `${fieldName} is required`
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

/**
 * Minimum length validation
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }
  return null
}

/**
 * Maximum length validation
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`
  }
  return null
}

/**
 * Number range validation
 * @param {number} value - Value to validate
 * @param {object} range - Range options
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const validateNumberRange = (value, range, fieldName = 'This field') => {
  const { min, max } = range
  
  if (min !== undefined && value < min) {
    return `${fieldName} must be at least ${min}`
  }
  
  if (max !== undefined && value > max) {
    return `${fieldName} must not exceed ${max}`
  }
  
  return null
}

/**
 * Create validation function for form
 * @param {object} schema - Validation schema
 * @returns {function} Validation function
 */
export const createValidator = (schema) => {
  return (values) => {
    const errors = {}
    
    Object.keys(schema).forEach((field) => {
      const validators = schema[field]
      const value = values[field]
      
      if (Array.isArray(validators)) {
        for (const validator of validators) {
          if (typeof validator === 'function') {
            const error = validator(value, values)
            if (error) {
              errors[field] = error
              break
            }
          }
        }
      } else if (typeof validators === 'function') {
        const error = validators(value, values)
        if (error) {
          errors[field] = error
        }
      }
    })
    
    return errors
  }
}

// Example validation schema
export const registrationSchema = {
  name: [
    (value) => validateRequired(value, 'Name'),
    (value) => validateMinLength(value, 2, 'Name'),
    (value) => validateMaxLength(value, 50, 'Name')
  ],
  email: [
    (value) => validateRequired(value, 'Email'),
    (value) => !validateEmail(value) ? 'Please enter a valid email address' : null
  ],
  password: [
    (value) => validateRequired(value, 'Password'),
    (value) => {
      const result = validatePassword(value, { minLength: 6 })
      return result.isValid ? null : result.errors[0]
    }
  ],
  bloodGroup: [
    (value) => validateRequired(value, 'Blood group'),
    (value) => !validateBloodGroup(value) ? 'Please select a valid blood group' : null
  ],
  district: [
    (value) => validateRequired(value, 'District')
  ],
  upazila: [
    (value) => validateRequired(value, 'Upazila')
  ]
}

export default {
  validateEmail,
  validatePassword,
  validateBloodGroup,
  validatePhone,
  validateURL,
  validateFutureDate,
  validateTime,
  validateFile,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumberRange,
  createValidator,
  registrationSchema
}