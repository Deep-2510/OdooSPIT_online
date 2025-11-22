const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    unique: true,
    required: true,
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier is required'],
  },
  warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required'],
  },
  status: {
    type: String,
    enum: ['draft', 'waiting', 'ready', 'done', 'canceled'],
    default: 'draft',
    index: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantityOrdered: {
        type: Number,
        required: [true, 'Quantity ordered is required'],
        min: [1, 'Quantity must be at least 1'],
      },
      quantityReceived: {
        type: Number,
        default: 0,
        min: [0, 'Received quantity cannot be negative'],
      },
      unit: String,
      costPrice: Number,
      remark: String,
    },
  ],
  purchaseOrderNumber: {
    type: String,
    trim: true,
  },
  invoiceNumber: {
    type: String,
    trim: true,
  },
  receivedDate: Date,
  expectedDate: {
    type: Date,
    required: true,
  },
  notes: {
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
  totalValue: Number,
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

receiptSchema.index({ receiptNumber: 1 });
receiptSchema.index({ status: 1, warehouse: 1 });

module.exports = mongoose.model('Receipt', receiptSchema);
