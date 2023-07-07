const { Router } = require('express');
const ProductManager = require('../../managers/ProductManager');

const pM = new ProductManager('products.json');
const router = Router();

//Diseño de las rutas (Endpoints de Products)

//GET api/products/:pid
router.get('/:pid', async (req, res) => {
    const { pid } = req.params
    try {
        if (pid) {
            const products = (await pM.getById(pid));
            if (products) {
                res.send(products);
            } else {
                res.status(404).send({
                    status: 404,
                    message: `El Producto con ID: ${req.params.pid} No Existe...`
                });
                return
            }
        }
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        })
    }

})
//GET api/products/
router.get('/', async (req, res) => {

    const { search, max, min, limit } = req.query

    try {
        const products = (await pM.getAll());
        let filtrados = products
        if (products.length == 0) {
            res.status(404).send({
                stauts: 404,
                message: `No se encontraron Productos registrados...`
            })
            return
        }
        if (search) {
            /// filtrar
            filtrados = filtrados
                .filter(p => p.keywords.includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
        }
        if (min || max) {
            filtrados = filtrados.filter(p => p.price >= (+min || 0) && p.price <= (+max || Infinity))
        }
        if (limit) {
            filtrados = filtrados.splice(0, limit);
        }
        res.send(filtrados)
    } catch (e) {
        res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        })
    }



})
//POST (add product) api/products/
router.post('/', async (req, res) => {
    const { body, headers } = req

    const product = await pM.create(body)

    res.status(201).send(product)
})
//DELETE api/products/:pid
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params

    if (!await pM.getById(pid)) {
        res.sendStatus(404)
        return
    }

    await pM.delete(pid)

    res.sendStatus(200)
})

//PUT api/products/:pid (modifica un  elemento existente)
router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const { body } = req

    try {
        if (!await pM.getById(pid)) {
            res.sendStatus(404)
            return
        }

        await pM.save(pid, body)
        res.sendStatus(202)
    } catch (e) {
        res.status(500).send({
            message: "Ha ocurrido un error en el servidor",
            exception: e.stack
        })
    }
})

module.exports = router