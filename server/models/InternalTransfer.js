const mongoose = require('mongoose');

const internalTransferSchema = new mongoose.Schema({
  transferNumber: {
    type: String,
    unique: true,
    required: true,
  },
  fromWarehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Source warehouse is required'],
  },
  toWarehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Destination warehouse is required'],
  },
  status: {
    type: String,
    enum: ['draft', 'ready', 'in_transit', 'received', 'canceled'],
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
      quantityRequested: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
      },
      quantityShipped: {
        type: Number,
        default: 0,
      },
      quantityReceived: {
        type: Number,
        default: 0,
      },
      unit: String,
      remark: String,
    },
  ],
  reason: {
    type: String,
    enum: ['production', 'rebalancing', 'consolidation', 'return', 'other'],
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  shippedDate: Date,
  receivedDate: Date,
  expectedDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  shippedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  receivedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
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

internalTransferSchema.index({ transferNumber: 1 });
internalTransferSchema.index({ status: 1 });

module.exports = mongoose.model('InternalTransfer', internalTransferSchema);
