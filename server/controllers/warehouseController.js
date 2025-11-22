const Warehouse = require('../models/Warehouse');

// @route   POST /api/warehouses
// @desc    Create a new warehouse
// @access  Private (Admin)
exports.createWarehouse = async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      city,
      state,
      zipCode,
      country,
      totalCapacity,
      capacityUnit,
      inchargeUserId,
    } = req.body;

    if (!name || !code || !address || !city || !state || !zipCode || !totalCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const warehouse = await Warehouse.create({
      name,
      code: code.toUpperCase(),
      location: {
        address,
        city,
        state,
        zipCode,
        country: country || 'India',
      },
      capacity: {
        totalCapacity,
        unit: capacityUnit || 'units',
      },
      inchargeUser: inchargeUserId,
    });

    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: {
        warehouse,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/warehouses
// @desc    Get all warehouses
// @access  Private
exports.getWarehouses = async (req, res) => {
  try {
    const { isActive } = req.query;

    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const warehouses = await Warehouse.find(query)
      .populate('inchargeUser', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        count: warehouses.length,
        warehouses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/warehouses/:id
// @desc    Get single warehouse
// @access  Private
exports.getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id)
      .populate('inchargeUser', 'name email phone');

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        warehouse,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/warehouses/:id
// @desc    Update warehouse
// @access  Private (Admin)
exports.updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow code update
    if (updates.code) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse code cannot be updated',
      });
    }

    const warehouse = await Warehouse.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('inchargeUser', 'name email phone');

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Warehouse updated successfully',
      data: {
        warehouse,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/warehouses/:id
// @desc    Deactivate warehouse
// @access  Private (Admin)
exports.deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Warehouse deactivated successfully',
      data: {
        warehouse,
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
