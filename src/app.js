const ProductManager = require('./ProductManager');
const express = require('express');
const path = require('path');


const pM = new ProductManager(path.join(__dirname, 'products.json'));

const app = express();
app.use(express.urlencoded({ extended: true }));


app.get('/products/:pid', async (req, res) => {

    if (req.params.pid) {
        const products = (await pM.getProductById(parseInt(req.params.pid)));
        if (products) {
            res.send(products);
        } else {
            res.send(`El Producto con ID: ${req.params.pid} No Existe...`);
        }
    }
})

app.get('/products', async (req, res) => {

    const products = (await pM.getProducts());
    const { limit } = req.query;

    if (limit) {
        const prodQry = products.splice(0, limit);
        prodQry.length > 0 ? res.send(prodQry) : res.send("No Existen Productos Registrados...");
    } else {
        const prodQry = products;
        prodQry.length > 0 ? res.send(prodQry) : res.send("No Existen Productos Registrados...");
    }
})


app.listen(8080, () => {
    console.log("Express Server waiting on port 8080...");
})

