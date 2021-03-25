const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name         : { type: String, required: true },
    price        : { type: Number, required: true },
    productImage : { type: String, default: null }
});

const product = mongoose.model('product', productSchema);

module.exports = product;