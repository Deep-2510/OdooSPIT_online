// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[^\d]/g, ''));
};

const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const validateQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0;
};

const validateSKU = (sku) => {
  return sku && sku.length > 0 && sku.length <= 50;
};

const validatePrice = (price) => {
  return price >= 0;
};

module.exports = {
  validateEmail,
  validatePhone,
  validateDate,
  validateQuantity,
  validateSKU,
  validatePrice,
};
