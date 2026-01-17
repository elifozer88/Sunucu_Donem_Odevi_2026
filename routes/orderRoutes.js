const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Sipariş rotaları
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;