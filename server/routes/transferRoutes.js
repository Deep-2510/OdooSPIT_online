const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');

router.post('/', transferController.createTransfer);
router.get('/', transferController.getTransfers);
router.get('/:id', transferController.getTransferById);
router.put('/:id/ship', transferController.shipTransfer);
router.put('/:id/receive', transferController.receiveTransfer);
router.delete('/:id', transferController.cancelTransfer);

module.exports = router;
