const { hash, compare } = require('bcrypt');
const jwt = require('jsonwebtoken');

const USER_COLL = require('../models/user');

const validateEmail = require('../utils/validateEmail');

exports.getAllUser = (req, res) => {
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
}

exports.signUpUser = (req, res) => {
    let { email, password } = req.body;

    USER_COLL.findOne({ email })
        .exec()
        .then(user => {
            if(!validateEmail(email)) {
                return res.status(500).json({
                    message: "Email is invalid"
                });
            } else if(user) {
                return res.status(409).json({
                    message: "Email is existed"
                });
            } 

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
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    }

exports.signInUser = (req, res) => {
    let { email, password } = req.body;

    USER_COLL.findOne({ email })
        .exec()
        .then(result => {
            if(!validateEmail(email)) {
                return res.status(500).json({
                    message: "Email is invalid"
                });
            } else if(!result) {
                return res.status(500).json({
                    message: "Email not found"
                });
            }

            compare(password, result.password, (err, isMatch) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } 

                if(!isMatch) {
                    return res.status(401).json({
                        message: "Password is not match"
                    });
                } else {
                    const token = jwt.sign(
                        {
                            email,
                            userID: result._id
                        },
                        "resfulapi-nodejs",
                        {
                            expiresIn: "1h"
                        }
                    )

                    return res.status(200).json({
                        message: "Login succeed",
                        _id: result._id,
                        email: result.email,
                        password: result.password,
                        token
                    });
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.getUserByID = (req, res) => {
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
}

exports.removeUserByID = (req, res) => {
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
}