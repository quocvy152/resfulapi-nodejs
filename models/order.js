const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product : { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    quantity: { type: Number, default: 1 }
});

const order = mongoose.model('order', orderSchema);

module.exports = order;