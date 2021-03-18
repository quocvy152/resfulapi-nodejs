const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const URI_LOCAL_MONGODB = "mongodb://127.0.0.1:27017/resfulapi-nodejs";
const PORT = process.env.PORT || 3000;

const USER_ROUTE = require('./routes/product');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));

app.use(morgan('dev'));

app.use('/products', USER_ROUTE);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            status: error.status || 500,
            message: error.message
        }
    });
});

// hide warning of mongodb
mongoose.connect(URI_LOCAL_MONGODB, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.once('open', () => app.listen(PORT, () => console.log(`Server start at PORT ${PORT}`)));