const multer = require('multer');

const pathStoreImgProd = "D:\\resfulapi-nodejs\\public\\productImage\\";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${pathStoreImgProd}`)
    },
    filename: function (req, file, cb) {
        let nameOfImage = file.originalname.substr(0, file.originalname.indexOf('.'));
        let typeOfImg = file.originalname.substr(file.originalname.indexOf('.') + 1, file.originalname.length);
        cb(null, nameOfImage + '-' + Date.now() + '.' + typeOfImg)
    }
})
   
var upload = multer({ storage });

module.exports = upload;