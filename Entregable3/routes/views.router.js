const { Router } = require("express");
const ProductManager = require('../managers/ProductManager');


const pM = new ProductManager('products.json');

const router = Router();

router.get('/chat', (req,res)=>{
    res.render('index',{
        style:'style'
    });
})

router.get('/', async (req, res)=>{
    const products = await pM.getAll();
    console.log(products[0].thumbnails[0])
    if(products){
        res.render('home',{
            products: products,
            title: 'Listado de Productos',
            realtimeProducts:false,
            style:'style'
            
        })
    }
})

router.get('/realtimeproducts', async (req, res)=>{
    const products = await pM.getAll();
    if(products){
        res.render('home',{
            products: products,
            title: 'Listado de Productos en Tiempo Real',
            realtimeProducts:true,
            style:'style',
            js:'realtimeproducts'
        })
    }
})

module.exports = router;