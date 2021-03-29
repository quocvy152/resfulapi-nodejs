const ORDER_COLL   = require('../models/order');
const PRODUCT_COLL = require('../models/product');

exports.getAllOrder = (req, res) => {
    ORDER_COLL.find({})
        .populate("product")
        .exec()
        .then(listOrder => {
            let detailOrder = listOrder.map(order => {
                return {
                    _id: order._id,
                    quantity: order.quantity,
                    product: order.product,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + order._id
                    }
                }
            });
            res.status(200).json({
                message: "Get list order",
                quantity: listOrder.length,
                listOrder: detailOrder
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.createOrder = (req, res) => {
    const { productID, quantity } = req.body;

    PRODUCT_COLL.findById({ _id: productID })
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            } 

            const order = new ORDER_COLL({
                product: product._id,
                quantity
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Order stored",
                createdOrder: result,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.getOrderByID = (req, res) => {
    const { orderID } = req.params;

    ORDER_COLL.findById({ _id: orderID })
        .populate("product")
        .then(order => {
            console.log({ order })
            if(order) {
                res.status(200).json({
                    message: "Get order by id",
                    order,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + order._id
                    }
                });
            } else {
                res.status(404).json({
                    message: "Order not found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.updateProducByID = (req, res) => {
    const { orderID } = req.params;

    const orderUpdate = {
        product: req.body.productID,
        quantity: 1
    };

    ORDER_COLL.findByIdAndUpdate({ _id: orderID }, {
        $set: orderUpdate
    }, { new: true })   
        .then(order => {

            res.status(200).json({
                message: "Updated order",
                order,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + order._id
                }
            });

        })
        .catch(err => {
            res.status(500).json({ 
                message: "Order not found",
                error: err
            });
        })

}

exports.removeOrderByID = (req, res) => {
    const { orderID } = req.params;

    ORDER_COLL.findByIdAndRemove({ _id: orderID })
        .populate("product")
        .select("_id product quantity")
        .then(result => {

            res.status(200).json({
                message: "Deleted order",
                orderRemoved: result,
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders"
                }
            })

        })
        .catch(err => {
            res.status(500).json({
                message: "Order not found",
                error: err
            });
        })
}