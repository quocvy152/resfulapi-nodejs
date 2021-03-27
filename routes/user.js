const express = require('express');
const router = express.Router();

const { hash, compare } = require('bcrypt');

const USER_COLL = require('../models/user');

const validateEmail = require('../utils/validateEmail');
const e = require('express');

router.route('/')
    .get((req, res) => {
        USER_COLL.find({})
            .exec()
            .then(listUser => {
                res.status(200).json({
                    message: "Get all user",
                    quantity: listUser.length,
                    listUser: listUser.map(user => {
                        return {
                            _id: user._id,
                            email: user.email,
                            password: user.password,
                            request: {
                                type: "GET",
                                url: "http://localhost:3000/users/" + user._id
                            }
                        }
                    })
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })
    })

router.route('/signup')    
    .post((req, res) => {
        let { email, password } = req.body;

        USER_COLL.findOne({ email }, (err, user) => {
            if(!validateEmail(email)) {
                res.status(500).json({
                    message: "Email is invalid"
                });
            } else if(user) {
                res.status(409).json({
                    message: "Email is existed"
                });
            } else {
                hash(password, 10, (err, hash) => {
                    if(err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        let newUser = new USER_COLL({ email, password: hash });

                        newUser
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: "User created",
                                    _id: result._id,
                                    email: result.email,
                                    password: result.password,
                                    request: {
                                        type: "GET",
                                        url: "http://localhost:3000/users/" + newUser._id
                                    }
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
    })

router.route('/:userID')
    .get((req, res) => {
        let { userID } = req.params;

        USER_COLL.findById({ _id: userID })
            .exec()
            .then(user => {
                if(!user) {
                    res.status(404).json({
                        message: "User not found"
                    });
                } else {
                    res.status(200).json({
                        message: "Get user by id",
                        _id: user._id,
                        email: user.email,
                        password: user.password,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/users"
                        }
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    })
    .patch((req, res) => {
        let { email, password } = req.body;
        let { userID } = req.params;

        /**
         * => Đầu tiên tìm xem id User có tồn tại hay không
         *      +Nếu không tồn tại thì báo User not found
         *      +Nếu tồn tại thì tiến hành kiểm tra xem email muốn thay đổi với email cũ có trùng nhau không 
         *          -> Nếu trùng thì không cho update
         *          -> Nếu không trùng thì tiến hành update
         *              -> Khi update lại kiểm tra xem email đã tồn tại hay chưa 
         */
        USER_COLL.findById({ _id: userID })
            .exec()
            .then(result => {
                if(!result) {
                    res.status(404).json({
                        message: "User not found"
                    });
                } else {
                    // check xem email muốn thay đổi có trùng với email cũ hay không
                    if(email === result.email) {
                        res.status(409).json({
                            message: "Email you want update is the same your old email"
                        });
                    } else {
                        USER_COLL.findOne({ email })
                            .exec()
                            .then(user => {
                                if(user) {
                                    res.status(409).json({
                                        message: "Email is exist"
                                    });
                                } else {
                                    hash(password, 10, (err, passHash) => {
                                        if(err) {
                                            res.status(500).json({
                                                error: err
                                            });
                                        } else {
                                            if(!validateEmail(email)) {
                                                res.status(500).json({
                                                    message: "Email is invalid"
                                                });
                                            } else {
                                                USER_COLL.findOneAndUpdate({ _id: result._id }, {
                                                    $set: { email, passHash }
                                                }, { new: true })
                                                    .then(userAfterUpdate => {
                                                        res.status(200).json({
                                                            _id: userAfterUpdate._id,
                                                            email: userAfterUpdate.email,
                                                            password: userAfterUpdate.password,
                                                            request: {
                                                                type: "GET",
                                                                url: "http://localhost:3000/users/" + userAfterUpdate._id
                                                            }
                                                        });
                                                    })
                                                    .catch(err => {
                                                        res.status(500).json({
                                                            error: err
                                                        })
                                                    })
                                            }
                                        }
                                    })
                                }
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                }
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    })
    .delete((req, res) => {
        let { userID } = req.params;

        USER_COLL.findByIdAndRemove({ _id: userID })
            .exec()
            .then(result => {
                if(!result) {
                    res.status(404).json({
                        message: "User not found"
                    });
                } else {
                    res.status(200).json({ 
                        message: "User removed",
                        userRemoved: result,
                        request: {
                            type: "POST",
                            url: "http://localhost:3000/users/signup"
                        }
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    })

module.exports = router;