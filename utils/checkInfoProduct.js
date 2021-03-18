module.exports = function (name, price) {
    if(!name && !price) return null;
    else if(!name) return { price } 
    else if(!price) return { name }
    else return { name, price }
}