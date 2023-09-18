const  cM = require('../dao/managers/carts/cart.db.manager');
const pM = require('../dao/managers/products/Product.db.manager');


const getById = async (req, res) => {
    const { cid } = req.params;
    try {
        let productsInCart = [];
        if (cid) {
            const cart = await cM.getById(cid);
            if (!cart) {
                res.status(404).send({
                    status: 404,
                    message: `El Cart con Id:${cid} No Existe...`
                })
                return
            }
            res.send(cart);
        }
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
};


const create =  async (req, res) => {
    const { body } = req

    try {
        const product = await cM.create(body);
        res.status(201).send(product);
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    };
};


const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params

    try {
        if (!await cM.getById(cid)) {
            res.status(404).send({
                status: 404,
                message: `El Cart con Id:${cid} No Existe...`
            });
            return;
        };
        if (!await pM.getById(pid)) {
            res.status(404).send({
                status: 404,
                message: `El Producto con Id:${pid} No Existe...`
            });
            return;
        };
        await cM.update(cid, pid);
        res.status(202).send({
            status: 202,
            message: `El Producto ha sido Agregado Correctamente al carrito...`
        });
    } catch (e) {
        res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        });
    }
};



module.exports = {
    getById,
    create,
    addProductToCart,
    
}