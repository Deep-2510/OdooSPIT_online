const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'Please provide a SKU'],
    unique: true,
    uppercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['raw_material', 'finished_goods', 'spare_parts', 'consumables', 'others'],
  },
  uom: {
    type: String,
    required: [true, 'Please provide a unit of measure'],
    enum: ['units', 'kg', 'liters', 'meters', 'pieces', 'boxes', 'cartons'],
    default: 'units',
  },
  reorderLevel: {
    type: Number,
    required: [true, 'Please provide a reorder level'],
    min: [0, 'Reorder level cannot be negative'],
  },
  reorderQuantity: {
    type: Number,
    required: [true, 'Please provide a reorder quantity'],
    min: [1, 'Reorder quantity must be at least 1'],
  },
  maxStockLevel: {
    type: Number,
    required: [true, 'Please provide a max stock level'],
    min: [0, 'Max stock level cannot be negative'],
  },
  minimumStockLevel: {
    type: Number,
    required: [true, 'Please provide a minimum stock level'],
    min: [0, 'Minimum stock level cannot be negative'],
  },
  price: {
    costPrice: {
      type: Number,
      required: [true, 'Please provide cost price'],
      min: [0, 'Cost price cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Please provide selling price'],
      min: [0, 'Selling price cannot be negative'],
    },
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
