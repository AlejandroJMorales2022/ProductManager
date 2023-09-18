const { Router } = require('express');
const controller = require('../../controllers/carts.controller')


const router = Router();

// route api/carts/:cid
router.get('/:cid', controller.getById);

//POST (add new cart) api/carts/
router.post('/', controller.create);

//PUT /:cid/product/:pid 
router.post('/:cid/product/:pid', controller.addProductToCart);

module.exports = router