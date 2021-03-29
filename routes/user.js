const express = require('express');
const router = express.Router();

const USER_CONTROLLER = require('../controller/user');

router.get(('/'), USER_CONTROLLER.getAllUser);

router.post(('/signup'), USER_CONTROLLER.signUpUser);

router.post(('/signin'), USER_CONTROLLER.signInUser);

router.get(('/:userID'), USER_CONTROLLER.getUserByID);

router.delete(('/:userID'), USER_CONTROLLER.removeUserByID);

module.exports = router;

// .patch((req, res) => {
//     let { email, password } = req.body;
//     let { userID } = req.params;

//     /**
//      * => Đầu tiên tìm xem id User có tồn tại hay không
//      *      +Nếu không tồn tại thì báo User not found
//      *      +Nếu tồn tại thì tiến hành kiểm tra xem email muốn thay đổi với email cũ có trùng nhau không 
//      *          -> Nếu trùng thì không cho update
//      *          -> Nếu không trùng thì tiến hành update
//      *              -> Khi update lại kiểm tra xem email đã tồn tại hay chưa 
//      */
//     USER_COLL.findById({ _id: userID })
//         .exec()
//         .then(result => {
//             if(!result) {
//                 res.status(404).json({
//                     message: "User not found"
//                 });
//             } else {
//                 // check xem email muốn thay đổi có trùng với email cũ hay không
//                 if(email === result.email) {
//                     res.status(409).json({
//                         message: "Email you want update is the same your old email"
//                     });
//                 } else {
//                     USER_COLL.findOne({ email })
//                         .exec()
//                         .then(user => {
//                             if(user) {
//                                 res.status(409).json({
//                                     message: "Email is exist"
//                                 });
//                             } else {
//                                 hash(password, 10, (err, passHash) => {
//                                     if(err) {
//                                         res.status(500).json({
//                                             error: err
//                                         });
//                                     } else {
//                                         if(!validateEmail(email)) {
//                                             res.status(500).json({
//                                                 message: "Email is invalid"
//                                             });
//                                         } else {
//                                             USER_COLL.findByIdAndUpdate({ _id: result._id }, {
//                                                 $set: { email, password: passHash }
//                                             }, { new: true })
//                                                 .then(userAfterUpdate => {
//                                                     console.log({ userAfterUpdate })
//                                                     res.status(200).json({
//                                                         _id: userAfterUpdate._id,
//                                                         email: userAfterUpdate.email,
//                                                         password: userAfterUpdate.password,
//                                                         request: {
//                                                             type: "GET",
//                                                             url: "http://localhost:3000/users/" + userAfterUpdate._id
//                                                         }
//                                                     });
//                                                 })
//                                                 .catch(err => {
//                                                     res.status(500).json({
//                                                         error: err
//                                                     })
//                                                 })
//                                         }
//                                     }
//                                 })
//                             }
//                         })
//                         .catch(err => {
//                             res.status(500).json({
//                                 error: err
//                             })
//                         })
//                 }
//             }
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             })
//         })
// })