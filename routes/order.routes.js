const { Router } = require('express')
const Order = require('../models/order.model')
const Product = require('../models/product.model')
const router = Router()

router.get('/order', async (req, res) => {
    const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('client seller').populate({
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
                    item.total = parseFloat(item.product.retail_price * item.quantity).toFixed(2)
                } else {
                    item.total = parseFloat(item.product.wholesale_price * item.quantity).toFixed(2)
                }
                total += item.total
            });
            order.total = parseFloat(total).toFixed(2)
            order.date = order.createdAt.getDate().toString() +' '+ months[order.createdAt.getMonth()] +' '+ order.createdAt.getFullYear().toString()
        }
        const dateOrders = orders.map((order)=>order.date)
        const dateUniqueOrders = [...new Set(dateOrders)]

        const ordersFilteredByDate = (date)=>{
          return orders.filter((order)=> order.date === date )
        }
        const dateWithOrdersFiltered = dateUniqueOrders.map((date)=>{return {date,orders:ordersFilteredByDate(date)} })
        res.status(200).json(dateWithOrdersFiltered)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/order/:idOrder', async (req, res) => {
    const { idOrder } = req.params
    try {
        const order = await Order.findById(idOrder).populate('client seller').populate({
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
                item.total = parseFloat(item.product.retail_price * item.quantity).toFixed(2)
            } else {
                item.total = parseFloat(item.product.wholesale_price * item.quantity).toFixed(2)
            }
            total += item.total
        });
        order.total = parseFloat(total).toFixed(2)
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/order', async (req, res) => {
    const user = req.user
    const { client, orderItems, payment } = req.body
    try {
        const newOrder = await Order.create({ seller: user._id, client, payment })
        await Order.findOneAndUpdate(newOrder._id, { $push: { order_items: { $each: orderItems } } })
        const order = await Order.findById(newOrder._id).populate('seller client').populate({
            path: 'order_items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }).lean()
        let total = 0
        order.order_items.forEach((item) => {
            if (item.quantity < 6) {
                item.total = parseFloat(item.product.retail_price * item.quantity).toFixed(2)
            } else {
                item.total = parseFloat(item.product.wholesale_price * item.quantity).toFixed(2)
            }
            total += item.total
        });
        order.total = parseFloat(total).toFixed(2)
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
        const order = await Order.findById(idOrder).populate('client seller').populate({
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
        const order = await Order.findById(idOrder).populate({
            path: 'order_items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        const orderItems = order.order_items
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product._id, { stock: item.product.stock + item.quantity })
        }
        await Order.findByIdAndDelete(idOrder)
        res.status(200).json('Successfully deleted order')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router