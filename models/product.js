const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : String,
    price: Number 
});

const product = mongoose.model('product', productSchema);

module.exports = product;