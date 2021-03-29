const express = require('express');
const router = express.Router();

const PRODUCT_CONTROLLER = require('../controller/products');

const uploadMulter = require('../utils/uploadMulter');

router.get(('/'), PRODUCT_CONTROLLER.getAllProduct);

router.post(('/'), uploadMulter.single('productImage'), PRODUCT_CONTROLLER.createProduct);

router.get(('/:productId'), PRODUCT_CONTROLLER.getProductByID);

router.patch(('/:productId'), uploadMulter.single('productImage'), PRODUCT_CONTROLLER.updateProductByID);

router.delete(('/:productId'), PRODUCT_CONTROLLER.removeProductByID);

module.exports = router;