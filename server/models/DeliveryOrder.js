const mongoose = require('mongoose');

const deliveryOrderSchema = new mongoose.Schema({
  deliveryNumber: {
    type: String,
    unique: true,
    required: true,
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
    },
    email: String,
    phone: String,
    address: String,
  },
  warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required'],
  },
  status: {
    type: String,
    enum: ['draft', 'picking', 'packed', 'ready', 'done', 'canceled'],
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
      quantityPicked: {
        type: Number,
        default: 0,
      },
      quantityPacked: {
        type: Number,
        default: 0,
      },
      quantityDelivered: {
        type: Number,
        default: 0,
      },
      unit: String,
      price: Number,
    },
  ],
  salesOrderNumber: {
    type: String,
    trim: true,
  },
  invoiceNumber: {
    type: String,
    trim: true,
  },
  pickingDate: Date,
  packingDate: Date,
  deliveryDate: Date,
  expectedDeliveryDate: {
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
  pickedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  packedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  deliveredBy: {
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

deliveryOrderSchema.index({ deliveryNumber: 1 });
deliveryOrderSchema.index({ status: 1, warehouse: 1 });

module.exports = mongoose.model('DeliveryOrder', deliveryOrderSchema);
