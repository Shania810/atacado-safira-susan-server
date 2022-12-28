const {Router} = require('express')
const  Product  = require('../models/product.model')
const router = Router()
router.get('/product',async(req,res)=>{
    try {
       const products = await Product.find()
       res.status(200).json(products)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
router.get('/product/:idProduct',async(req,res)=>{
    const  {idProduct} = req.params
    try {
        const product = await Product.findById(idProduct)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
module.exports = router