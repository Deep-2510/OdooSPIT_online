const StockAdjustment = require('../models/StockAdjustment');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const { generateAdjustmentNumber } = require('../utils/documentGenerator');
const { updateStockOnAdjustment } = require('../utils/stockManager');

// @route   POST /api/adjustments
// @desc    Create a new stock adjustment
// @access  Private
exports.createAdjustment = async (req, res) => {
  try {
    const { warehouseId, adjustmentType, countingDate, items, reason, notes } = req.body;

    if (!warehouseId || !adjustmentType || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide warehouse, adjustment type, and items',
      });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    const adjustmentNumber = await generateAdjustmentNumber(StockAdjustment);

    const processedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      const difference = item.physicalQuantity - item.recordedQuantity;

      processedItems.push({
        product: item.productId,
        recordedQuantity: item.recordedQuantity,
        physicalQuantity: item.physicalQuantity,
        difference,
        reason: item.reason,
        unit: product.uom,
        notes: item.notes,
      });
    }

    const adjustment = await StockAdjustment.create({
      adjustmentNumber,
      warehouse: warehouseId,
      adjustmentType,
      items: processedItems,
      countingDate,
      reason,
      createdBy: req.user.id,
    });

    await adjustment.populate('warehouse items.product createdBy');

    res.status(201).json({
      success: true,
      message: 'Adjustment created successfully',
      data: {
        adjustment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/adjustments
// @desc    Get all adjustments with filters
// @access  Private
exports.getAdjustments = async (req, res) => {
  try {
    const { status, warehouseId, adjustmentType, fromDate, toDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (warehouseId) {
      query.warehouse = warehouseId;
    }

    if (adjustmentType) {
      query.adjustmentType = adjustmentType;
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        query.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        query.createdAt.$lte = new Date(toDate);
      }
    }

    const adjustments = await StockAdjustment.find(query)
      .populate('warehouse items.product createdBy approvedBy')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        count: adjustments.length,
        adjustments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/adjustments/:id
// @desc    Get single adjustment
// @access  Private
exports.getAdjustmentById = async (req, res) => {
  try {
    const adjustment = await StockAdjustment.findById(req.params.id)
      .populate('warehouse items.product createdBy approvedBy');

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        adjustment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/adjustments/:id/approve
// @desc    Approve and confirm adjustment
// @access  Private
exports.approveAdjustment = async (req, res) => {
  try {
    const { id } = req.params;

    const adjustment = await StockAdjustment.findById(id);

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found',
      });
    }

    if (adjustment.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft adjustments can be approved',
      });
    }

    // Apply adjustments to stock
    for (const item of adjustment.items) {
      try {
        await updateStockOnAdjustment(
          item.product,
          adjustment.warehouse,
          item.difference,
          adjustment._id,
          req.user.id
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `Stock adjustment failed: ${error.message}`,
        });
      }
    }

    adjustment.status = 'done';
    adjustment.adjustedDate = new Date();
    adjustment.approvedBy = req.user.id;
    await adjustment.save();

    await adjustment.populate('warehouse items.product createdBy approvedBy');

    res.status(200).json({
      success: true,
      message: 'Adjustment approved and stock updated',
      data: {
        adjustment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/adjustments/:id
// @desc    Update adjustment
// @access  Private
exports.updateAdjustment = async (req, res) => {
  try {
    const { id } = req.params;
    const adjustment = await StockAdjustment.findById(id);

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found',
      });
    }

    if (adjustment.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft adjustments can be updated',
      });
    }

    const updates = req.body;
    Object.assign(adjustment, updates);
    await adjustment.save();

    await adjustment.populate('warehouse items.product createdBy');

    res.status(200).json({
      success: true,
      message: 'Adjustment updated successfully',
      data: {
        adjustment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/adjustments/:id
// @desc    Cancel adjustment
// @access  Private
exports.cancelAdjustment = async (req, res) => {
  try {
    const adjustment = await StockAdjustment.findById(req.params.id);

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found',
      });
    }

    if (adjustment.status === 'done' || adjustment.status === 'canceled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed or already canceled adjustment',
      });
    }

    adjustment.status = 'canceled';
    await adjustment.save();

    res.status(200).json({
      success: true,
      message: 'Adjustment canceled successfully',
      data: {
        adjustment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = exports;
