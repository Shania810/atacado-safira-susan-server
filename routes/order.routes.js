const {Router} = require('express')
const Order = require('../models/order.model')
const router = Router()
router.get('/order',async(req,res)=>{
   try {
    const orders = await Order.find({}).sort({createdAt: -1})
    res.status(200).json(orders)
   } catch (error) {
    res.status(500).json({message: error.message})
   }
})
router.post('/order',async(req,res)=>{
    const order = req.body
    try {
      const newOrder = await Order.create(order)
      res.status(201).json(newOrder)
    } catch (error) {
       res.status(500).json({message: error.message})
    }
})
router.put('/order/:idOrder',async(req,res)=>{
    const {idOrder} = req.params
    const update = req.body
    try {
        const updatedOrder = await Order.findByIdAndUpdate(idOrder,update,{new:true})
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
router.delete('/order/:idOrder',async(req,res)=>{
    const idOrder = req.params
    try {
        await Order.findByIdAndDelete(idOrder)
        res.status(200).json('Successfully deleted order')
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
module.exports = router