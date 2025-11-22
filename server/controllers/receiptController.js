const Receipt = require('../models/Receipt');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const Supplier = require('../models/Supplier');
const { generateReceiptNumber } = require('../utils/documentGenerator');
const { updateStockOnReceipt } = require('../utils/stockManager');

// @route   POST /api/receipts
// @desc    Create a new receipt
// @access  Private
exports.createReceipt = async (req, res) => {
  try {
    const { supplierId, warehouseId, expectedDate, items, purchaseOrderNumber, invoiceNumber, notes } = req.body;

    if (!supplierId || !warehouseId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide supplier, warehouse, and items',
      });
    }

    // Verify supplier and warehouse exist
    const supplier = await Supplier.findById(supplierId);
    const warehouse = await Warehouse.findById(warehouseId);

    if (!supplier || !warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Supplier or Warehouse not found',
      });
    }

    // Generate receipt number
    const receiptNumber = await generateReceiptNumber(Receipt);

    // Calculate total value
    let totalValue = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      const itemValue = item.quantityOrdered * (item.costPrice || product.price.costPrice);
      totalValue += itemValue;

      processedItems.push({
        product: item.productId,
        quantityOrdered: item.quantityOrdered,
        unit: product.uom,
        costPrice: item.costPrice || product.price.costPrice,
        remark: item.remark,
      });
    }

    const receipt = await Receipt.create({
      receiptNumber,
      supplier: supplierId,
      warehouse: warehouseId,
      items: processedItems,
      purchaseOrderNumber,
      invoiceNumber,
      expectedDate,
      notes,
      createdBy: req.user.id,
      totalValue,
    });

    await receipt.populate('supplier warehouse createdBy');

    res.status(201).json({
      success: true,
      message: 'Receipt created successfully',
      data: {
        receipt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/receipts
// @desc    Get all receipts with filters
// @access  Private
exports.getReceipts = async (req, res) => {
  try {
    const { status, warehouseId, supplierId, fromDate, toDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (warehouseId) {
      query.warehouse = warehouseId;
    }

    if (supplierId) {
      query.supplier = supplierId;
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

    const receipts = await Receipt.find(query)
      .populate('supplier warehouse createdBy approvedBy')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        count: receipts.length,
        receipts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/receipts/:id
// @desc    Get single receipt
// @access  Private
exports.getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('supplier warehouse items.product createdBy approvedBy');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        receipt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/receipts/:id/receive
// @desc    Confirm receipt and update stock
// @access  Private
exports.confirmReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { receivedItems } = req.body;

    const receipt = await Receipt.findById(id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    if (receipt.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft receipts can be confirmed',
      });
    }

    if (!receivedItems || receivedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide received items',
      });
    }

    // Update items with received quantities
    for (const receivedItem of receivedItems) {
      const item = receipt.items.id(receivedItem.itemId);
      if (item) {
        item.quantityReceived = receivedItem.quantityReceived;

        // Update stock
        try {
          await updateStockOnReceipt(
            item.product,
            receipt.warehouse,
            receivedItem.quantityReceived,
            receipt._id,
            req.user.id
          );
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: `Stock update failed: ${error.message}`,
          });
        }
      }
    }

    receipt.status = 'done';
    receipt.receivedDate = new Date();
    receipt.approvedBy = req.user.id;
    await receipt.save();

    await receipt.populate('supplier warehouse createdBy approvedBy');

    res.status(200).json({
      success: true,
      message: 'Receipt confirmed and stock updated',
      data: {
        receipt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/receipts/:id
// @desc    Update receipt
// @access  Private
exports.updateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await Receipt.findById(id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    if (receipt.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft receipts can be updated',
      });
    }

    const updates = req.body;
    Object.assign(receipt, updates);
    await receipt.save();

    await receipt.populate('supplier warehouse createdBy');

    res.status(200).json({
      success: true,
      message: 'Receipt updated successfully',
      data: {
        receipt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/receipts/:id
// @desc    Cancel receipt
// @access  Private
exports.cancelReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    if (receipt.status === 'done' || receipt.status === 'canceled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed or already canceled receipt',
      });
    }

    receipt.status = 'canceled';
    await receipt.save();

    res.status(200).json({
      success: true,
      message: 'Receipt canceled successfully',
      data: {
        receipt,
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
