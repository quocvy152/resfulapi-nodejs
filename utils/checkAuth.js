const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if(req.path === '/users/signin' || req.path === '/users/signup') next();
        else {
            let token = req.headers.authorization.split(" ")[1];
            let decoded = jwt.verify(token, "resfulapi-nodejs");
            req.userData = decoded;
            next();
        }
    } catch (err) {
        return res.status(401).json({
            message: "Authentication failed"
        })
    }
}