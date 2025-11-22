const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a warehouse name'],
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Please provide a warehouse code'],
    unique: true,
    uppercase: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'India',
    },
  },
  inchargeUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  capacity: {
    totalCapacity: {
      type: Number,
      required: [true, 'Please provide warehouse capacity'],
    },
    usedCapacity: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      enum: ['units', 'kg', 'liters', 'cbm'],
      default: 'units',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
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

warehouseSchema.index({ code: 1 });

module.exports = mongoose.model('Warehouse', warehouseSchema);
