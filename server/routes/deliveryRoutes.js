const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

router.post('/', deliveryController.createDelivery);
router.get('/', deliveryController.getDeliveries);
router.get('/:id', deliveryController.getDeliveryById);
router.put('/:id/pick', deliveryController.pickItems);
router.put('/:id/pack', deliveryController.packItems);
router.put('/:id/deliver', deliveryController.confirmDelivery);
router.delete('/:id', deliveryController.cancelDelivery);

module.exports = router;
