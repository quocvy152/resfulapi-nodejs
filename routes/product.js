const express = require('express');
const router = express.Router();

const PRODUCT_COLL = require('../models/product');

// hàm kiểm tra và chỉ trả về những trường có giá trị của Object body tránh có field nhận giá trị null
const checkInfoProduct = require('../utils/checkInfoProduct');

router.route('/')
    .get((req, res) => {
        const listProduct = PRODUCT_COLL.find({});
        listProduct
            .then(listProduct => {

                let resListProd = listProduct.map(product => {
                    return {
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + product._id
                        }
                    }
                });

                res.status(200).json({
                    message: "Get list product",
                    quantity: listProduct.length,
                    listProduct: resListProd
                });

            })
            .catch(err => res.status(500).json({
                error: err
            }));
    })
    .post((req, res) => {
        let { name, price } = req.body;

        const product = new PRODUCT_COLL({ name, price: parseInt(price) });
        product
            .save()
            .then(newProduct => {

                let infoProduct = {
                    id: newProduct._id,
                    name: newProduct.name,
                    price: newProduct.price,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + newProduct._id
                    }
                }

                res.status(201).json({
                    message: "Created product",
                    newProduct: infoProduct
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
            .select("_id name price")
            .exec()
            .then(product => {

                if(!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }

                let infoProduct = {
                    id: product._id,
                    name: product.name,
                    price: product.price
                }

                res.status(200).json({
                    message: "Get product by Id",
                    infoProduct,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products"
                    }
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
                .then(productAfterUpdate => {

                    let infoProductAfterUpdate = {
                        id: productAfterUpdate._id,
                        name: productAfterUpdate.name,
                        price: productAfterUpdate.price,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + productAfterUpdate._id
                        }
                    }

                    res.status(200).json({
                        message: "Update product",
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

        let infoProductRemoved = PRODUCT_COLL.findByIdAndRemove({ _id: productId });
        infoProductRemoved
            .select("_id name price")
            .then(product => {

                if(!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }

                let productDeleted = {
                    id: product._id,
                    name: product.name,
                    price: product.price
                }

                res.status(200).json({
                    message: "Deleted product",
                    productDeleted,
                    request: {
                        type: "POST",
                        url: "http://localhost:3000/products"
                    }
                });

            })
            .catch(err => res.status(500).json({
                error: err
            }));

    })

module.exports = router;