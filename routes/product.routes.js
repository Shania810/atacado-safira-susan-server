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
router.post('/product/:idCategory',async(req,res)=>{
    const product = req.body
    const {idCategory} = req.params
    try {
        const newProduct = await Product.create({...product,category: idCategory})
        res.status(201).json(newProduct)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
router.put('/product/:idProduct',async(req,res)=>{
   const {idProduct} = req.params
   const update = req.body
   console.log(idProduct,update)
   try {
    const updatedProduct = await Product.findByIdAndUpdate(idProduct,update,{new:true})
    res.status(200).json(updatedProduct)
   } catch (error) {
    res.status(500).json({message: error.message})
   }
})
router.delete('/product/:idProduct',async(req,res)=>{
    const {idProduct} = req.params
    try {
     await Product.findByIdAndRemove(idProduct)
     res.status(200).json('deleted with sucess')
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
module.exports = router