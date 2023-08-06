const cartModel = require('../models/carts.model');


class CartManager {

    async getById(id) {
        const cart = await cartModel.findOne({ _id: id })
            .populate({ path: "products.product", select: "title description price" });

        return cart;
    }


    async create() {
        const cart = await cartModel.create({ products: [] })

        return cart
    }

    async update(cid, pid) {

        //buscar el carrito en el que quiero agregar el producto
        const cart = await cartModel.findOne({ _id: cid });
        //si lo encuentro, buscar el producto
        if (cart._id != '') {
            //buscar si el producto ya existe
            const existing = cart.products.find((prod) => prod.product == pid);
            if (existing) {
                cart.products.forEach((prod, index) => {
                    if (prod.product == pid) {
                        cart.products[index] = { ...prod, product: pid, quantity: (prod.quantity + 1) };
                    }
                });
            } else {
                cart.products = [...cart.products, { product: pid, quantity: 1 }]
            }
        }
        const cartUpdated = await cartModel.updateOne({ _id: cid }, { $set: { products: cart.products } });


        return cartUpdated
    }
}

module.exports = new CartManager();