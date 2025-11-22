import { useState } from 'react'

export const useForm = (initialValues = {}, validateFn) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Validate on change
    if (validateFn) {
      const newErrors = validateFn({ ...values, [name]: newValue })
      setErrors(newErrors)
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
  }

  const setValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  const isValid = !validateFn || Object.keys(validateFn(values)).length === 0

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValue,
    reset,
    isValid
  }
}