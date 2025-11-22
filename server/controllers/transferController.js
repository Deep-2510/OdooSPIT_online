const InternalTransfer = require('../models/InternalTransfer');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const { generateTransferNumber } = require('../utils/documentGenerator');
const { updateStockOnTransfer } = require('../utils/stockManager');

// @route   POST /api/transfers
// @desc    Create a new internal transfer
// @access  Private
exports.createTransfer = async (req, res) => {
  try {
    const { fromWarehouseId, toWarehouseId, reason, expectedDate, items, notes } = req.body;

    if (!fromWarehouseId || !toWarehouseId || !reason || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields',
      });
    }

    if (fromWarehouseId === toWarehouseId) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination warehouses must be different',
      });
    }

    const fromWh = await Warehouse.findById(fromWarehouseId);
    const toWh = await Warehouse.findById(toWarehouseId);

    if (!fromWh || !toWh) {
      return res.status(404).json({
        success: false,
        message: 'One or both warehouses not found',
      });
    }

    const transferNumber = await generateTransferNumber(InternalTransfer);

    const processedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      processedItems.push({
        product: item.productId,
        quantityRequested: item.quantityRequested,
        unit: product.uom,
        remark: item.remark,
      });
    }

    const transfer = await InternalTransfer.create({
      transferNumber,
      fromWarehouse: fromWarehouseId,
      toWarehouse: toWarehouseId,
      items: processedItems,
      reason,
      expectedDate,
      notes,
      createdBy: req.user.id,
    });

    await transfer.populate('fromWarehouse toWarehouse items.product createdBy');

    res.status(201).json({
      success: true,
      message: 'Transfer created successfully',
      data: {
        transfer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/transfers
// @desc    Get all transfers with filters
// @access  Private
exports.getTransfers = async (req, res) => {
  try {
    const { status, fromWarehouseId, toWarehouseId, reason } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (fromWarehouseId) {
      query.fromWarehouse = fromWarehouseId;
    }

    if (toWarehouseId) {
      query.toWarehouse = toWarehouseId;
    }

    if (reason) {
      query.reason = reason;
    }

    const transfers = await InternalTransfer.find(query)
      .populate('fromWarehouse toWarehouse items.product createdBy shippedBy receivedBy')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        count: transfers.length,
        transfers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/transfers/:id
// @desc    Get single transfer
// @access  Private
exports.getTransferById = async (req, res) => {
  try {
    const transfer = await InternalTransfer.findById(req.params.id)
      .populate('fromWarehouse toWarehouse items.product createdBy shippedBy receivedBy');

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        transfer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/transfers/:id/ship
// @desc    Ship transfer items
// @access  Private
exports.shipTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippedItems } = req.body;

    const transfer = await InternalTransfer.findById(id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found',
      });
    }

    if (transfer.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft transfers can be shipped',
      });
    }

    for (const shippedItem of shippedItems) {
      const item = transfer.items.id(shippedItem.itemId);
      if (item) {
        item.quantityShipped = shippedItem.quantityShipped;

        try {
          await updateStockOnTransfer(
            item.product,
            transfer.fromWarehouse,
            transfer.toWarehouse,
            shippedItem.quantityShipped,
            transfer._id,
            req.user.id
          );
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: `Stock transfer failed: ${error.message}`,
          });
        }
      }
    }

    transfer.status = 'in_transit';
    transfer.shippedDate = new Date();
    transfer.shippedBy = req.user.id;
    await transfer.save();

    res.status(200).json({
      success: true,
      message: 'Items shipped and stock transferred',
      data: {
        transfer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/transfers/:id/receive
// @desc    Receive transfer at destination
// @access  Private
exports.receiveTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { receivedItems } = req.body;

    const transfer = await InternalTransfer.findById(id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found',
      });
    }

    if (transfer.status !== 'in_transit') {
      return res.status(400).json({
        success: false,
        message: 'Only in-transit transfers can be received',
      });
    }

    for (const receivedItem of receivedItems) {
      const item = transfer.items.id(receivedItem.itemId);
      if (item) {
        item.quantityReceived = receivedItem.quantityReceived;
      }
    }

    transfer.status = 'received';
    transfer.receivedDate = new Date();
    transfer.receivedBy = req.user.id;
    await transfer.save();

    res.status(200).json({
      success: true,
      message: 'Transfer received successfully',
      data: {
        transfer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/transfers/:id
// @desc    Cancel transfer
// @access  Private
exports.cancelTransfer = async (req, res) => {
  try {
    const transfer = await InternalTransfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found',
      });
    }

    if (transfer.status === 'received' || transfer.status === 'canceled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed or already canceled transfer',
      });
    }

    transfer.status = 'canceled';
    await transfer.save();

    res.status(200).json({
      success: true,
      message: 'Transfer canceled successfully',
      data: {
        transfer,
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
