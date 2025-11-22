const mongoose = require('mongoose');

const stockBalanceSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: true,
    index: true,
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  reservedStock: {
    type: Number,
    default: 0,
    min: [0, 'Reserved stock cannot be negative'],
  },
  availableStock: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

stockBalanceSchema.index({ product: 1, warehouse: 1 }, { unique: true });

// Virtual to calculate available stock
stockBalanceSchema.virtual('effectiveAvailableStock').get(function () {
  return this.currentStock - this.reservedStock;
});

module.exports = mongoose.model('StockBalance', stockBalanceSchema);
