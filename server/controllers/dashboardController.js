const StockLedger = require('../models/StockLedger');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const Receipt = require('../models/Receipt');
const DeliveryOrder = require('../models/DeliveryOrder');
const InternalTransfer = require('../models/InternalTransfer');
const StockAdjustment = require('../models/StockAdjustment');
const StockBalance = require('../models/StockBalance');

// @route   GET /api/dashboard/summary
// @desc    Get dashboard KPI summary
// @access  Private
exports.getDashboardSummary = async (req, res) => {
  try {
    const { warehouseId } = req.query;

    // Build queries
    let warehouseQuery = {};
    if (warehouseId) {
      warehouseQuery = { warehouse: warehouseId };
    }

    // Total products
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Stock info
    const stocksQuery = { ...warehouseQuery };
    const stocks = await StockBalance.find(stocksQuery).populate('product');

    // Low stock items
    const lowStockItems = stocks.filter((stock) => {
      const product = stock.product;
      return (
        stock.currentStock <= product.reorderLevel &&
        stock.currentStock > 0
      );
    });

    // Out of stock items
    const outOfStockItems = stocks.filter((stock) => stock.currentStock === 0);

    // Pending receipts
    let receiptQuery = { status: { $in: ['draft', 'waiting', 'ready'] } };
    if (warehouseId) {
      receiptQuery.warehouse = warehouseId;
    }
    const pendingReceipts = await Receipt.countDocuments(receiptQuery);

    // Pending deliveries
    let deliveryQuery = { status: { $in: ['draft', 'picking', 'packed'] } };
    if (warehouseId) {
      deliveryQuery.warehouse = warehouseId;
    }
    const pendingDeliveries = await DeliveryOrder.countDocuments(deliveryQuery);

    // Pending transfers
    const pendingTransfers = await InternalTransfer.countDocuments({
      status: { $in: ['draft', 'ready', 'in_transit'] },
      ...(warehouseId && {
        $or: [{ fromWarehouse: warehouseId }, { toWarehouse: warehouseId }],
      }),
    });

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalProducts,
          totalStockLocations: stocks.length,
          lowStockItems: lowStockItems.length,
          outOfStockItems: outOfStockItems.length,
          pendingReceipts,
          pendingDeliveries,
          pendingTransfers,
        },
        lowStockDetails: lowStockItems.slice(0, 10),
        outOfStockDetails: outOfStockItems.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/dashboard/stock-movement
// @desc    Get stock movement report
// @access  Private
exports.getStockMovement = async (req, res) => {
  try {
    const { warehouseId, fromDate, toDate, movementType } = req.query;

    let query = {};

    if (warehouseId) {
      query.warehouse = warehouseId;
    }

    if (movementType) {
      query.movementType = movementType;
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

    const movements = await StockLedger.find(query)
      .populate('product warehouse createdBy')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: {
        count: movements.length,
        movements,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/dashboard/product-stock-history/:productId
// @desc    Get stock history for a specific product
// @access  Private
exports.getProductStockHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { warehouseId, fromDate, toDate } = req.query;

    let query = { product: productId };

    if (warehouseId) {
      query.warehouse = warehouseId;
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

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const history = await StockLedger.find(query)
      .populate('warehouse createdBy')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        product: {
          id: product._id,
          name: product.name,
          sku: product.sku,
        },
        historyCount: history.length,
        history,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/dashboard/warehouse-stock
// @desc    Get warehouse stock summary
// @access  Private
exports.getWarehouseStock = async (req, res) => {
  try {
    const { warehouseId } = req.query;

    let query = {};
    if (warehouseId) {
      query.warehouse = warehouseId;
    }

    const stocks = await StockBalance.find(query)
      .populate('product warehouse')
      .sort({ currentStock: -1 });

    const totalValue = stocks.reduce((acc, stock) => {
      return acc + stock.currentStock * (stock.product?.price?.costPrice || 0);
    }, 0);

    const totalQuantity = stocks.reduce((acc, stock) => {
      return acc + stock.currentStock;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalItems: stocks.length,
          totalQuantity,
          totalValue,
        },
        stocks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/dashboard/operations-summary
// @desc    Get operations summary (receipts, deliveries, transfers, adjustments)
// @access  Private
exports.getOperationsSummary = async (req, res) => {
  try {
    const { warehouseId, fromDate, toDate } = req.query;

    let dateQuery = {};
    if (fromDate || toDate) {
      dateQuery.createdAt = {};
      if (fromDate) {
        dateQuery.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        dateQuery.createdAt.$lte = new Date(toDate);
      }
    }

    // Receipts status breakdown
    let receiptQuery = { ...dateQuery };
    if (warehouseId) {
      receiptQuery.warehouse = warehouseId;
    }
    const receiptsByStatus = await Receipt.aggregate([
      { $match: receiptQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Deliveries status breakdown
    let deliveryQuery = { ...dateQuery };
    if (warehouseId) {
      deliveryQuery.warehouse = warehouseId;
    }
    const deliveriesByStatus = await DeliveryOrder.aggregate([
      { $match: deliveryQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Transfers status breakdown
    let transferQuery = { ...dateQuery };
    if (warehouseId) {
      transferQuery.$or = [
        { fromWarehouse: warehouseId },
        { toWarehouse: warehouseId },
      ];
    }
    const transfersByStatus = await InternalTransfer.aggregate([
      { $match: transferQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Adjustments status breakdown
    let adjustmentQuery = { ...dateQuery };
    if (warehouseId) {
      adjustmentQuery.warehouse = warehouseId;
    }
    const adjustmentsByStatus = await StockAdjustment.aggregate([
      { $match: adjustmentQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        receiptsByStatus,
        deliveriesByStatus,
        transfersByStatus,
        adjustmentsByStatus,
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
