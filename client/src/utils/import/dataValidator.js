// utils/import/dataValidator.js
import * as yup from 'yup';

export const productImportSchema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  sku: yup.string()
    .required('SKU is required')
    .matches(/^[A-Z0-9_-]+$/, 'SKU must contain only uppercase letters, numbers, hyphens, and underscores'),
  category: yup.string().required('Category is required'),
  uom: yup.string().required('Unit of measure is required'),
  costPrice: yup.number()
    .typeError('Cost price must be a number')
    .min(0, 'Cost price cannot be negative')
    .required('Cost price is required'),
  sellingPrice: yup.number()
    .typeError('Selling price must be a number')
    .min(0, 'Selling price cannot be negative')
    .test('price-check', 'Selling price must be greater than cost price', function(value) {
      const { costPrice } = this.parent;
      return !costPrice || !value || value >= costPrice;
    }),
  reorderLevel: yup.number()
    .typeError('Reorder level must be a number')
    .min(0, 'Reorder level cannot be negative'),
  minimumStockLevel: yup.number()
    .typeError('Minimum stock level must be a number')
    .min(0, 'Minimum stock level cannot be negative'),
  maxStockLevel: yup.number()
    .typeError('Maximum stock level must be a number')
    .min(0, 'Maximum stock level cannot be negative'),
});

export const validateImportData = async (data, schema) => {
  const errors = [];

  for (let i = 0; i < data.length; i++) {
    try {
      await schema.validate(data[i], { abortEarly: false });
    } catch (validationError) {
      errors.push({
        row: i + 1, // 1-based row numbering for user readability
        errors: validationError.inner.map(err => ({
          field: err.path,
          message: err.message,
        })),
        data: data[i],
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    totalRows: data.length,
    validRows: data.length - errors.length,
  };
};

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvText = event.target.result;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
              let value = values[index] || '';
              
              // Try to convert to number if possible
              if (!isNaN(value) && value !== '') {
                value = Number(value);
              }
              
              // Convert boolean strings
              if (value === 'true') value = true;
              if (value === 'false') value = false;
              
              row[header] = value;
            });
            
            return row;
          });
        
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse CSV file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};