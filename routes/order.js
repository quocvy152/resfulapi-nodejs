const express = require('express');
const router = express.Router();

const ORDER_CONTROLLER = require('../controller/order');

router.get(('/'), ORDER_CONTROLLER.getAllOrder);

router.post(('/'), ORDER_CONTROLLER.createOrder);

router.get(('/:orderID'), ORDER_CONTROLLER.getOrderByID);

router.patch(('/:orderID'), ORDER_CONTROLLER.updateProducByID);

router.delete(('/:orderID'), ORDER_CONTROLLER.updateProducByID)
    
module.exports = router;