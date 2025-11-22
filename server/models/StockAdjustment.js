const mongoose = require('mongoose');

const stockAdjustmentSchema = new mongoose.Schema({
  adjustmentNumber: {
    type: String,
    unique: true,
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required'],
  },
  status: {
    type: String,
    enum: ['draft', 'ready', 'done', 'canceled'],
    default: 'draft',
    index: true,
  },
  adjustmentType: {
    type: String,
    enum: ['physical_count', 'damage', 'loss', 'excess', 'return', 'correction'],
    required: [true, 'Adjustment type is required'],
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
      recordedQuantity: {
        type: Number,
        required: [true, 'Recorded quantity is required'],
        min: [0, 'Recorded quantity cannot be negative'],
      },
      physicalQuantity: {
        type: Number,
        required: [true, 'Physical quantity is required'],
        min: [0, 'Physical quantity cannot be negative'],
      },
      difference: {
        type: Number,
      },
      reason: {
        type: String,
        enum: ['damage', 'loss', 'excess', 'expiry', 'quality_issue', 'counting_error'],
      },
      unit: String,
      notes: String,
    },
  ],
  countingDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  adjustedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

stockAdjustmentSchema.index({ adjustmentNumber: 1 });
stockAdjustmentSchema.index({ status: 1, warehouse: 1 });

module.exports = mongoose.model('StockAdjustment', stockAdjustmentSchema);
