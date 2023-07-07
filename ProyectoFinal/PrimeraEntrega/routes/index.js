const {Router} = require('express');
const ProductRouter = require('./api/products.router');


// /api
const router = Router();

// route de products
router.use('/products', ProductRouter);



module.exports = {
    api: router
}
