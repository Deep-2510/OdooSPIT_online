const mongoose = require('mongoose');

const stockLedgerSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
    index: true,
  },
  warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required'],
    index: true,
  },
  movementType: {
    type: String,
    enum: ['inward', 'outward', 'transfer_out', 'transfer_in', 'adjustment', 'return'],
    required: [true, 'Movement type is required'],
    index: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    validate: {
      validator: function (v) {
        return v !== 0;
      },
      message: 'Quantity cannot be zero',
    },
  },
  reference: {
    type: String,
    enum: ['receipt', 'delivery', 'transfer', 'adjustment'],
    required: true,
    index: true,
  },
  referenceId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Reference ID is required'],
    index: true,
  },
  balanceBefore: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

stockLedgerSchema.index({ product: 1, warehouse: 1, createdAt: -1 });

module.exports = mongoose.model('StockLedger', stockLedgerSchema);
