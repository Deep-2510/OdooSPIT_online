const DeliveryOrder = require('../models/DeliveryOrder');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const { generateDeliveryNumber } = require('../utils/documentGenerator');
const { updateStockOnDelivery } = require('../utils/stockManager');

// @route   POST /api/deliveries
// @desc    Create a new delivery order
// @access  Private
exports.createDelivery = async (req, res) => {
  try {
    const { customer, warehouseId, expectedDeliveryDate, items, salesOrderNumber, invoiceNumber, notes } = req.body;

    if (!customer || !warehouseId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer, warehouse, and items',
      });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    const deliveryNumber = await generateDeliveryNumber(DeliveryOrder);

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

      const itemValue = item.quantityOrdered * (item.price || product.price.sellingPrice);
      totalValue += itemValue;

      processedItems.push({
        product: item.productId,
        quantityOrdered: item.quantityOrdered,
        unit: product.uom,
        price: item.price || product.price.sellingPrice,
      });
    }

    const delivery = await DeliveryOrder.create({
      deliveryNumber,
      customer,
      warehouse: warehouseId,
      items: processedItems,
      salesOrderNumber,
      invoiceNumber,
      expectedDeliveryDate,
      notes,
      createdBy: req.user.id,
      totalValue,
    });

    await delivery.populate('warehouse createdBy');

    res.status(201).json({
      success: true,
      message: 'Delivery order created successfully',
      data: {
        delivery,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/deliveries
// @desc    Get all delivery orders with filters
// @access  Private
exports.getDeliveries = async (req, res) => {
  try {
    const { status, warehouseId, fromDate, toDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

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

    const deliveries = await DeliveryOrder.find(query)
      .populate('warehouse items.product createdBy pickedBy packedBy deliveredBy')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        count: deliveries.length,
        deliveries,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/deliveries/:id
// @desc    Get single delivery order
// @access  Private
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await DeliveryOrder.findById(req.params.id)
      .populate('warehouse items.product createdBy pickedBy packedBy deliveredBy');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        delivery,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/deliveries/:id/pick
// @desc    Mark items as picked
// @access  Private
exports.pickItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { pickedItems } = req.body;

    const delivery = await DeliveryOrder.findById(id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found',
      });
    }

    if (delivery.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only pick from draft orders',
      });
    }

    for (const pickedItem of pickedItems) {
      const item = delivery.items.id(pickedItem.itemId);
      if (item) {
        item.quantityPicked = pickedItem.quantityPicked;
      }
    }

    delivery.status = 'picking';
    delivery.pickingDate = new Date();
    delivery.pickedBy = req.user.id;
    await delivery.save();

    res.status(200).json({
      success: true,
      message: 'Items marked as picked',
      data: {
        delivery,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/deliveries/:id/pack
// @desc    Mark items as packed
// @access  Private
exports.packItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { packedItems } = req.body;

    const delivery = await DeliveryOrder.findById(id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found',
      });
    }

    if (delivery.status !== 'picking') {
      return res.status(400).json({
        success: false,
        message: 'Items must be picked before packing',
      });
    }

    for (const packedItem of packedItems) {
      const item = delivery.items.id(packedItem.itemId);
      if (item) {
        item.quantityPacked = packedItem.quantityPacked;
      }
    }

    delivery.status = 'packed';
    delivery.packingDate = new Date();
    delivery.packedBy = req.user.id;
    await delivery.save();

    res.status(200).json({
      success: true,
      message: 'Items marked as packed',
      data: {
        delivery,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/deliveries/:id/deliver
// @desc    Confirm delivery and update stock
// @access  Private
exports.confirmDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveredItems } = req.body;

    const delivery = await DeliveryOrder.findById(id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found',
      });
    }

    if (delivery.status !== 'packed') {
      return res.status(400).json({
        success: false,
        message: 'Items must be packed before delivery',
      });
    }

    for (const deliveredItem of deliveredItems) {
      const item = delivery.items.id(deliveredItem.itemId);
      if (item) {
        item.quantityDelivered = deliveredItem.quantityDelivered;

        try {
          await updateStockOnDelivery(
            item.product,
            delivery.warehouse,
            deliveredItem.quantityDelivered,
            delivery._id,
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

    delivery.status = 'done';
    delivery.deliveryDate = new Date();
    delivery.deliveredBy = req.user.id;
    await delivery.save();

    res.status(200).json({
      success: true,
      message: 'Delivery confirmed and stock updated',
      data: {
        delivery,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/deliveries/:id
// @desc    Cancel delivery order
// @access  Private
exports.cancelDelivery = async (req, res) => {
  try {
    const delivery = await DeliveryOrder.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery order not found',
      });
    }

    if (delivery.status === 'done' || delivery.status === 'canceled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed or already canceled delivery',
      });
    }

    delivery.status = 'canceled';
    await delivery.save();

    res.status(200).json({
      success: true,
      message: 'Delivery canceled successfully',
      data: {
        delivery,
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
