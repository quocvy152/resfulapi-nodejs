const express = require('express');
const router = express.Router();

const PRODUCT_COLL = require('../models/product');

const checkInfoProduct = require('../utils/checkInfoProduct');

router.route('/')
    .get((req, res) => {
        const listProduct = PRODUCT_COLL.find({});
        listProduct
            .then(listProduct => {
                res.status(200).json({
                    message: "Handling GET request to /products",
                    listProduct
                });
            })
            .catch(err => res.status(500).json({
                error: err
            }));
    })
    .post((req, res) => {
        let { name, price } = req.body;

        const product = new PRODUCT_COLL({ name, price });
        product
            .save()
            .then(newProduct => {
                res.status(201).json({
                    message: "Handling POST request to /products",
                    createdProduct: newProduct
                });
            })
            .catch(err => res.status(500).json({
                error: err
            }));
    });

router.route('/:productId')
    .get((req, res) => {
        const { productId } = req.params;

        PRODUCT_COLL.findById({ _id: productId })
            .exec()
            .then(infoProduct => {
                if(!infoProduct) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }
                res.status(200).json({
                    message: "Handling GET request get infoProduct",
                    infoProduct
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })
    })
    .patch((req, res) => {
        const { productId } = req.params;
        const { name, price } = req.body;

        const updateObj = checkInfoProduct(name, price);

        if(!updateObj) {
            res.status(500).json({
                message: "Cannot update with whole info of product null"
            })
        } else {
            PRODUCT_COLL.findByIdAndUpdate({ _id: productId }, {
                $set: updateObj 
            }, { new: true })
                .exec()
                .then(infoProductAfterUpdate => {
                    console.log({ infoProductAfterUpdate })
                    res.status(200).json({
                        message: "Handling PATCH request to /products/:productId",
                        infoProductAfterUpdate
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        }

        
    })
    .delete((req, res) => {
        const { productId } = req.params;

        let infoProductRemoved = PRODUCT_COLL.findByIdAndDelete({ _id: productId });
        infoProductRemoved
            .then(product => {
                if(!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }
                res.status(200).json({
                    message: "Handling DELETE request to /products",
                    productRemoved: product
                });
            })
            .catch(err => res.status(500).json({
                error: err
            }));
    })

module.exports = router;