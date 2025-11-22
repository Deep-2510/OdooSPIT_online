const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

router.post('/', receiptController.createReceipt);
router.get('/', receiptController.getReceipts);
router.get('/:id', receiptController.getReceiptById);
router.put('/:id/receive', receiptController.confirmReceipt);
router.put('/:id', receiptController.updateReceipt);
router.delete('/:id', receiptController.cancelReceipt);

module.exports = router;
