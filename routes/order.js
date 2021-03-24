const express = require('express');
const { Router } = require('express');
const router = express.Router();

const ORDER_COLL   = require('../models/order');
const PRODUCT_COLL = require('../models/product');

router.route('/')
    .get((req, res) => {

        ORDER_COLL.find({})
            .populate("product")
            .exec()
            .then(listOrder => {

                let resDetailOrder = listOrder.map(order => {
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
                    listOrder: resDetailOrder
                });

            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })

    })
    .post((req, res) => {
        const { productID } = req.body;

        const order = new ORDER_COLL({
            product: productID,
            quantity: 1
        });

        order   
            .save()
            .then(order => {

                res.status(201).json({
                    message: "Created order",
                    order,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + order._id
                    }
                });

            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })

    })

router.route('/:orderID')
    .get((req, res) => {
        const { orderID } = req.params;

        ORDER_COLL.findById({ _id: orderID })
            .populate("product")
            .then(order => {
                res.status(200).json({
                    message: "Get order by id",
                    order,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + order._id
                    }
                });
            })
            .catch(err => {
                error: err
            })
    })
    .patch((req, res) => {
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
                    error: err
                });
            })

    })
    .delete((req, res) => {
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
                    error: err
                });
            })
    })

module.exports = router;