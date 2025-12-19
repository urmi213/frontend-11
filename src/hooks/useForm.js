import { useState, useCallback } from 'react'

const useForm = (initialState = {}, validate = null) => {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }, [])

  // Handle blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // Validate on blur if validator provided
    if (validate) {
      const validationErrors = validate(values)
      setErrors(validationErrors)
    }
  }, [values, validate])

  // Set field value manually
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  // Set multiple values
  const setValuesMultiple = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }))
  }, [])

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialState)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialState])

  // Validate form
  const validateForm = useCallback(() => {
    if (!validate) return true
    
    const validationErrors = validate(values)
    setErrors(validationErrors)
    
    // Return true if no errors
    return Object.keys(validationErrors).length === 0
  }, [values, validate])

  // Handle submit
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e?.preventDefault()
      
      setIsSubmitting(true)
      
      // Validate before submit
      const isValid = validateForm()
      
      if (isValid) {
        try {
          await onSubmit(values, { resetForm })
        } catch (error) {
          console.error('Form submission error:', error)
        }
      }
      
      setIsSubmitting(false)
    }
  }, [values, validateForm, resetForm])

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0

  // Check if form is dirty (different from initial)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialState)

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    setValues: setValuesMultiple,
    resetForm,
    validateForm,
    handleSubmit,
    setErrors,
    setTouched
  }
}

export default useForm