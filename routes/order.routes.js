const { Router } = require('express')
const Order = require('../models/order.model')
const Product = require('../models/product.model')
const router = Router()
router.get('/order', async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate({
            path: 'order_items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }).lean()
        for (const order of orders) {
            let total = 0
            order.order_items.forEach((item) => {
                item.total = 0
                if (item.quantity < 6) {
                    item.total = item.product.retail_price * item.quantity
                } else {
                    item.total = item.product.wholesale_price * item.quantity
                }
                total += item.total
            });
            order.total = total
        }
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
        }).lean()
        let total = 0
        order.order_items.forEach((item) => {
            item.total = 0
            if (item.quantity < 6) {
                item.total = item.product.retail_price * item.quantity
            } else {
                item.total = item.product.wholesale_price * item.quantity
            }
            total += item.total
        });
        order.total = total
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.post('/order', async (req, res) => {
    const user = req.user
    const { orderItems } = req.body
    try {
        const newOrder = await Order.create({ seller: user._id }).lean()
        await Order.findOneAndUpdate(newOrder._id, { $push: { order_items: { $each: orderItems } } })
        const order = await Order.findById(newOrder._id).populate({
            path: 'order_items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }).lean()
        order.order_items.forEach((item) => {
            if (item.quantity < 6) {
                item.total = item.product.retail_price * item.quantity
            } else {
                item.total = item.product.wholesale_price * item.quantity
            }
            order.total += item.total
        });
        res.status(201).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.put('/order/:idOrder', async (req, res) => {
    const { idOrder } = req.params
    const update = req.body
    try {
        await Order.findOneAndUpdate(idOrder, update, { new: true })
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
router.delete('/order/:idOrder', async (req, res) => {
    const { idOrder } = req.params
    try {
        const order = Order.findById(idOrder).populate({
            path: 'order_items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        for (const item of order.order_items) {
            await Product.findByIdAndUpdate(item.product._id, { stock: item.product.stock + item.quantity })
        }
        await Order.findByIdAndDelete(idOrder)
        res.status(200).json('Successfully deleted order')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router