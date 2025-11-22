const StockBalance = require('../models/StockBalance');
const StockLedger = require('../models/StockLedger');

// Update stock balance when receipt is confirmed
const updateStockOnReceipt = async (product, warehouse, quantity, receiptId, userId) => {
  try {
    let stockBalance = await StockBalance.findOne({ product, warehouse });

    const balanceBefore = stockBalance ? stockBalance.currentStock : 0;
    const balanceAfter = balanceBefore + quantity;

    if (!stockBalance) {
      stockBalance = await StockBalance.create({
        product,
        warehouse,
        currentStock: quantity,
        availableStock: quantity,
      });
    } else {
      stockBalance.currentStock += quantity;
      stockBalance.availableStock = stockBalance.currentStock - stockBalance.reservedStock;
      await stockBalance.save();
    }

    // Log in stock ledger
    await StockLedger.create({
      product,
      warehouse,
      movementType: 'inward',
      quantity,
      reference: 'receipt',
      referenceId: receiptId,
      balanceBefore,
      balanceAfter,
      createdBy: userId,
      remark: `Stock received for receipt ID: ${receiptId}`,
    });

    return stockBalance;
  } catch (error) {
    throw new Error(`Stock update failed: ${error.message}`);
  }
};

// Update stock balance when delivery is confirmed
const updateStockOnDelivery = async (product, warehouse, quantity, deliveryId, userId) => {
  try {
    let stockBalance = await StockBalance.findOne({ product, warehouse });

    if (!stockBalance || stockBalance.currentStock < quantity) {
      throw new Error('Insufficient stock available');
    }

    const balanceBefore = stockBalance.currentStock;
    const balanceAfter = balanceBefore - quantity;

    stockBalance.currentStock -= quantity;
    stockBalance.availableStock = stockBalance.currentStock - stockBalance.reservedStock;
    await stockBalance.save();

    // Log in stock ledger
    await StockLedger.create({
      product,
      warehouse,
      movementType: 'outward',
      quantity,
      reference: 'delivery',
      referenceId: deliveryId,
      balanceBefore,
      balanceAfter,
      createdBy: userId,
      remark: `Stock delivered for delivery ID: ${deliveryId}`,
    });

    return stockBalance;
  } catch (error) {
    throw new Error(`Stock update failed: ${error.message}`);
  }
};

// Update stock on internal transfer
const updateStockOnTransfer = async (
  product,
  fromWarehouse,
  toWarehouse,
  quantity,
  transferId,
  userId
) => {
  try {
    // Deduct from source warehouse
    let fromStock = await StockBalance.findOne({ product, warehouse: fromWarehouse });
    if (!fromStock || fromStock.currentStock < quantity) {
      throw new Error('Insufficient stock in source warehouse');
    }

    const fromBalanceBefore = fromStock.currentStock;
    const fromBalanceAfter = fromBalanceBefore - quantity;

    fromStock.currentStock -= quantity;
    fromStock.availableStock = fromStock.currentStock - fromStock.reservedStock;
    await fromStock.save();

    // Add to destination warehouse
    let toStock = await StockBalance.findOne({ product, warehouse: toWarehouse });

    const toBalanceBefore = toStock ? toStock.currentStock : 0;
    const toBalanceAfter = toBalanceBefore + quantity;

    if (!toStock) {
      toStock = await StockBalance.create({
        product,
        warehouse: toWarehouse,
        currentStock: quantity,
        availableStock: quantity,
      });
    } else {
      toStock.currentStock += quantity;
      toStock.availableStock = toStock.currentStock - toStock.reservedStock;
      await toStock.save();
    }

    // Log in stock ledger for both warehouses
    await StockLedger.create({
      product,
      warehouse: fromWarehouse,
      movementType: 'transfer_out',
      quantity,
      reference: 'transfer',
      referenceId: transferId,
      balanceBefore: fromBalanceBefore,
      balanceAfter: fromBalanceAfter,
      createdBy: userId,
      remark: `Transfer out to warehouse ${toWarehouse}`,
    });

    await StockLedger.create({
      product,
      warehouse: toWarehouse,
      movementType: 'transfer_in',
      quantity,
      reference: 'transfer',
      referenceId: transferId,
      balanceBefore: toBalanceBefore,
      balanceAfter: toBalanceAfter,
      createdBy: userId,
      remark: `Transfer in from warehouse ${fromWarehouse}`,
    });

    return { fromStock, toStock };
  } catch (error) {
    throw new Error(`Stock transfer failed: ${error.message}`);
  }
};

// Update stock on adjustment
const updateStockOnAdjustment = async (product, warehouse, difference, adjustmentId, userId) => {
  try {
    let stockBalance = await StockBalance.findOne({ product, warehouse });

    if (!stockBalance && difference < 0) {
      throw new Error('Cannot adjust stock below zero');
    }

    const balanceBefore = stockBalance ? stockBalance.currentStock : 0;
    const balanceAfter = balanceBefore + difference;

    if (balanceAfter < 0) {
      throw new Error('Adjustment would result in negative stock');
    }

    if (!stockBalance) {
      if (difference > 0) {
        stockBalance = await StockBalance.create({
          product,
          warehouse,
          currentStock: difference,
          availableStock: difference,
        });
      }
    } else {
      stockBalance.currentStock += difference;
      stockBalance.availableStock = stockBalance.currentStock - stockBalance.reservedStock;
      await stockBalance.save();
    }

    // Log in stock ledger
    await StockLedger.create({
      product,
      warehouse,
      movementType: 'adjustment',
      quantity: Math.abs(difference),
      reference: 'adjustment',
      referenceId: adjustmentId,
      balanceBefore,
      balanceAfter,
      createdBy: userId,
      remark: `Stock adjustment - ${difference > 0 ? 'increase' : 'decrease'}`,
    });

    return stockBalance;
  } catch (error) {
    throw new Error(`Stock adjustment failed: ${error.message}`);
  }
};

module.exports = {
  updateStockOnReceipt,
  updateStockOnDelivery,
  updateStockOnTransfer,
  updateStockOnAdjustment,
};
