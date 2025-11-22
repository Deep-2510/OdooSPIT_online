const Product = require('../models/Product');
const StockBalance = require('../models/StockBalance');

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Inventory Manager)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      category,
      uom,
      reorderLevel,
      reorderQuantity,
      maxStockLevel,
      minimumStockLevel,
      costPrice,
      sellingPrice,
    } = req.body;

    // Validation
    if (!name || !sku || !category || !uom) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists',
      });
    }

    const product = await Product.create({
      name,
      sku: sku.toUpperCase(),
      description,
      category,
      uom,
      reorderLevel,
      reorderQuantity,
      maxStockLevel,
      minimumStockLevel,
      price: {
        costPrice,
        sellingPrice,
      },
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    const { category, isActive, search } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search.toUpperCase() } },
      ];
    }

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Get stock info for each product
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const stocks = await StockBalance.find({ product: product._id }).populate('warehouse');
        return {
          ...product.toObject(),
          stocks,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        count: productsWithStock.length,
        products: productsWithStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/products/:id
// @desc    Get single product with stock details
// @access  Private
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const stocks = await StockBalance.find({ product: product._id })
      .populate('warehouse');

    res.status(200).json({
      success: true,
      data: {
        product: {
          ...product.toObject(),
          stocks,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Inventory Manager)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow SKU update
    if (updates.sku) {
      return res.status(400).json({
        success: false,
        message: 'SKU cannot be updated',
      });
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/products/:id
// @desc    Soft delete product (set isActive to false)
// @access  Private (Inventory Manager)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/products/stock/summary
// @desc    Get product stock summary
// @access  Private
exports.getStockSummary = async (req, res) => {
  try {
    const { warehouseId } = req.query;

    let query = { currentStock: { $gt: 0 } };
    if (warehouseId) {
      query.warehouse = warehouseId;
    }

    const stocks = await StockBalance.find(query)
      .populate('product')
      .populate('warehouse');

    res.status(200).json({
      success: true,
      data: {
        count: stocks.length,
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

module.exports = exports;
