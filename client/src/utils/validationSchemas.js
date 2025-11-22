// client/src/utils/validationSchemas.js
import * as yup from 'yup';

// Common validation patterns
export const patterns = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^\+?[\d\s-()]{10,}$/,
  sku: /^[A-Z0-9_-]+$/,
  zipCode: /^\d{5}(-\d{4})?$/,
};

// Common validation messages
export const messages = {
  required: 'This field is required',
  email: 'Invalid email address',
  phone: 'Invalid phone number',
  min: (min) => `Must be at least ${min}`,
  max: (max) `Must be less than ${max}`,
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be less than ${max} characters`,
};

// User validation
export const userValidation = {
  login: yup.object({
    email: yup.string()
      .required(messages.required)
      .email(messages.email),
    password: yup.string()
      .required(messages.required)
      .min(6, messages.minLength(6)),
  }),

  register: yup.object({
    name: yup.string()
      .required(messages.required)
      .min(2, messages.minLength(2))
      .max(50, messages.maxLength(50)),
    email: yup.string()
      .required(messages.required)
      .email(messages.email),
    phone: yup.string()
      .matches(patterns.phone, messages.phone),
    password: yup.string()
      .required(messages.required)
      .min(8, messages.minLength(8))
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one number'),
    confirmPassword: yup.string()
      .required(messages.required)
      .oneOf([yup.ref('password')], 'Passwords must match'),
    role: yup.string()
      .required(messages.required),
  }),
};

// Product validation
export const productValidation = {
  create: yup.object({
    name: yup.string()
      .required(messages.required)
      .min(2, messages.minLength(2))
      .max(100, messages.maxLength(100)),
    sku: yup.string()
      .required(messages.required)
      .matches(patterns.sku, 'SKU can only contain uppercase letters, numbers, hyphens, and underscores')
      .max(50, messages.maxLength(50)),
    description: yup.string()
      .max(500, messages.maxLength(500)),
    category: yup.string()
      .required(messages.required),
    uom: yup.string()
      .required(messages.required),
    costPrice: yup.number()
      .typeError('Must be a number')
      .required(messages.required)
      .min(0, messages.min(0)),
    sellingPrice: yup.number()
      .typeError('Must be a number')
      .required(messages.required)
      .min(0, messages.min(0))
      .test('price-check', 'Selling price must be greater than cost price', function(value) {
        const { costPrice } = this.parent;
        return !costPrice || !value || value >= costPrice;
      }),
    reorderLevel: yup.number()
      .typeError('Must be a number')
      .required(messages.required)
      .min(0, messages.min(0)),
    reorderQuantity: yup.number()
      .typeError('Must be a number')
      .required(messages.required)
      .min(1, messages.min(1)),
    minimumStockLevel: yup.number()
      .typeError('Must be a number')
      .min(0, messages.min(0))
      .test('min-max', 'Minimum stock must be less than maximum stock', function(value) {
        const { maxStockLevel } = this.parent;
        return !maxStockLevel || !value || value <= maxStockLevel;
      }),
    maxStockLevel: yup.number()
      .typeError('Must be a number')
      .min(0, messages.min(0))
      .test('min-max', 'Maximum stock must be greater than minimum stock', function(value) {
        const { minimumStockLevel } = this.parent;
        return !minimumStockLevel || !value || value >= minimumStockLevel;
      }),
    supplier: yup.string()
      .required(messages.required),
  }),
};

// Receipt validation
export const receiptValidation = {
  create: yup.object({
    supplier: yup.string()
      .required(messages.required),
    warehouse: yup.string()
      .required(messages.required),
    purchaseOrderNumber: yup.string()
      .max(50, messages.maxLength(50)),
    invoiceNumber: yup.string()
      .max(50, messages.maxLength(50)),
    expectedDate: yup.date()
      .required(messages.required),
    items: yup.array()
      .of(
        yup.object({
          product: yup.string().required(messages.required),
          quantityOrdered: yup.number()
            .typeError('Must be a number')
            .required(messages.required)
            .min(1, messages.min(1)),
          quantityReceived: yup.number()
            .typeError('Must be a number')
            .min(0, messages.min(0)),
          costPrice: yup.number()
            .typeError('Must be a number')
            .required(messages.required)
            .min(0, messages.min(0)),
        })
      )
      .min(1, 'At least one item is required'),
  }),
};

// Delivery validation
export const deliveryValidation = {
  create: yup.object({
    customer: yup.object({
      name: yup.string()
        .required(messages.required)
        .min(2, messages.minLength(2))
        .max(100, messages.maxLength(100)),
      email: yup.string()
        .email(messages.email),
      phone: yup.string()
        .matches(patterns.phone, messages.phone),
      address: yup.object({
        street: yup.string().required(messages.required),
        city: yup.string().required(messages.required),
        state: yup.string().required(messages.required),
        zipCode: yup.string()
          .matches(patterns.zipCode, 'Invalid ZIP code')
          .required(messages.required),
        country: yup.string().required(messages.required),
      }),
    }),
    warehouse: yup.string()
      .required(messages.required),
    salesOrderNumber: yup.string()
      .max(50, messages.maxLength(50)),
    expectedDeliveryDate: yup.date()
      .required(messages.required),
    items: yup.array()
      .of(
        yup.object({
          product: yup.string().required(messages.required),
          quantity: yup.number()
            .typeError('Must be a number')
            .required(messages.required)
            .min(1, messages.min(1)),
        })
      )
      .min(1, 'At least one item is required'),
  }),
};

// Warehouse validation
export const warehouseValidation = {
  create: yup.object({
    name: yup.string()
      .required(messages.required)
      .min(2, messages.minLength(2))
      .max(100, messages.maxLength(100)),
    code: yup.string()
      .required(messages.required)
      .max(10, messages.maxLength(10))
      .matches(/^[A-Z0-9]+$/, 'Code must contain only uppercase letters and numbers'),
    location: yup.object({
      address: yup.string().required(messages.required),
      city: yup.string().required(messages.required),
      state: yup.string().required(messages.required),
      zipCode: yup.string()
        .matches(patterns.zipCode, 'Invalid ZIP code')
        .required(messages.required),
      country: yup.string().required(messages.required),
    }),
    capacity: yup.object({
      totalCapacity: yup.number()
        .typeError('Must be a number')
        .required(messages.required)
        .min(1, messages.min(1)),
      unit: yup.string().required(messages.required),
    }),
  }),
};