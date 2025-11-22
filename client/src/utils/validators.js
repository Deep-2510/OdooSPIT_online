export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateSKU = (sku) => {
  return sku.length >= 3 && /^[A-Za-z0-9-]+$/.test(sku)
}

export const validateQuantity = (quantity) => {
  return !isNaN(quantity) && quantity >= 0
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}