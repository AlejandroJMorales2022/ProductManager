
/* import express from 'express';
import fs from 'fs/promises';
import path from "path"; */
/* import ProductManager from './ProductManager'; */
const ProductManager = require('./ProductManager')
const express = require('express')
const path = require('path')


const pM = new ProductManager(path.join(__dirname, 'products.json'));

const app = express();
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res) => {
    const products = (await pM.getProducts())
    products.length > 0 ? res.send(products) : res.send("No Existen Productos Registrados...")
})
app.get('/products/:pid', async (req, res) => {
    const products = (await pM.getProducts())

    const {limit} = req.query

    if (req.params.pid){
        const prodQry = products.filter(prod => prod.id == req.params.pid)
        prodQry.length > 0 ? res.send(prodQry) : res.send(`El Producto con ID: ${req.params.pid} No Existe...`)
    }    
})

app.get('/products', async (req, res) => {
    const products = (await pM.getProducts())

    const {limit} = req.query
    console.log(req.query)

    if(limit){
        const prodQry = products.splice(0,limit)
        
         prodQry.length > 0 ? res.send(prodQry) : res.send("No Existen Productos Registrados...")
    }else{
        const prodQry = products
        prodQry.length > 0 ? res.send(prodQry) : res.send("No Existen Productos Registrados...")
    }
    
})


app.listen(8080, () => {
    console.log("Express Server waiting on port 8080...")
})

