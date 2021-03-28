module.exports = function (req, name, price) {
    if(!name && !price && !req.file) return null;
    else if(!name && !price) return { productImage: req.file.filename } 
    else if(!name && !req.file) return { price }
    else if(!price && !req.file) return { name }
    else if(!name) return { price, productImage: req.file.filename }
    else if(!price) return { name, productImage: req.file.filename }
    else if(!req.file) return { name, price }
    else return { name, price, productImage: req.file.filename }
}