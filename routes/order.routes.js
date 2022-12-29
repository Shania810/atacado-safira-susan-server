const { Router } = require('express')
const Order = require('../models/order.model')
const router = Router()
router.get('/order', async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/order/:idOrder', async (req, res) => {
    const { idOrder } = req.params
    try {
        const order = await Order.findById(idOrder).populate({
            path: 'order_items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.post('/order', async (req, res) => {
    const { orderItems, seller } = req.body
    try {
        const newOrder = await Order.create({ seller: seller })
        await Order.findOneAndUpdate(newOrder._id, { $push: { order_items: { $each: orderItems } } })
        const order = await Order.findById(newOrder._id).populate({
            path: 'order_items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })

        res.status(201).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.put('/order/:idOrder', async (req, res) => {
    const { idOrder } = req.params
    const update = req.body
    try {
        const updatedOrder = await Order.findByIdAndUpdate(idOrder, update, { new: true })
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.delete('/order/:idOrder', async (req, res) => {
    const { idOrder } = req.params
    try {
        await Order.findByIdAndDelete(idOrder)
        res.status(200).json('Successfully deleted order')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router