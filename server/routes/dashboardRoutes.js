const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/summary', dashboardController.getDashboardSummary);
router.get('/stock-movement', dashboardController.getStockMovement);
router.get('/product-stock-history/:productId', dashboardController.getProductStockHistory);
router.get('/warehouse-stock', dashboardController.getWarehouseStock);
router.get('/operations-summary', dashboardController.getOperationsSummary);

module.exports = router;
