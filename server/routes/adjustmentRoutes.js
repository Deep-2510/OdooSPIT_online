const express = require('express');
const router = express.Router();
const adjustmentController = require('../controllers/adjustmentController');

router.post('/', adjustmentController.createAdjustment);
router.get('/', adjustmentController.getAdjustments);
router.get('/:id', adjustmentController.getAdjustmentById);
router.put('/:id/approve', adjustmentController.approveAdjustment);
router.put('/:id', adjustmentController.updateAdjustment);
router.delete('/:id', adjustmentController.cancelAdjustment);

module.exports = router;
