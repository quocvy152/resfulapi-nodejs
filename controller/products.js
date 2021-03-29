const PRODUCT_COLL = require('../models/product');

// hàm kiểm tra và chỉ trả về những trường có giá trị của Object body tránh có field nhận giá trị null
const checkInfoProduct = require('../utils/checkInfoProduct');

exports.getAllProduct = (req, res) => {
    const listProduct = PRODUCT_COLL.find({});
    listProduct
        .then(listProduct => {

            let resListProd = listProduct.map(product => {
                return {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    productImage: product.productImage,
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
}

exports.createProduct = (req, res) => {
    let { name, price } = req.body;

    const product = new PRODUCT_COLL({ name, price: parseInt(price), productImage: req.file.filename });
    product
        .save()
        .then(newProduct => {

            let infoProduct = {
                id: newProduct._id,
                name: newProduct.name,
                price: newProduct.price,
                productImage: newProduct.productImage,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + newProduct._id
                }
            }

            res.status(201).json({
                message: "Create product success",
                newProduct: infoProduct
            });

        })
        .catch(err => res.status(500).json({
            error: err
        }));
}

exports.getProductByID = (req, res) => {
    const { productId } = req.params;

    PRODUCT_COLL.findById({ _id: productId })
        .select("_id name price productImage")
        .exec()
        .then(product => {
            if(!product) {
                res.status(404).json({
                    message: "Product not found"
                });
            } else {
                res.status(200).json({
                    message: "Get product by Id",
                    product,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products"
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.updateProductByID = (req, res) => {
    const { productId } = req.params;
    const { name, price } = req.body;

    const updateObj = checkInfoProduct(req, name, price);

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
                    productImage: productAfterUpdate.productImage,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + productAfterUpdate._id
                    }
                }

                res.status(200).json({
                    message: "Update product success",
                    infoProductAfterUpdate
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })

    }
    
}

exports.removeProductByID = (req, res) => {
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
                message: "Delete product success",
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

}