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
      res.status(200).json(newOrder)
    } catch (error) {
       res.status(500).json({message: error.message})
    }
})
module.exports = router