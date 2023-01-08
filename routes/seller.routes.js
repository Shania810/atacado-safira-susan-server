const { Router } = require('express');
const User = require('../models/user.model')
const Order = require('../models/order.model')
const isAdmin = require('../middlewares/user.middleware')
const router = Router()

router.get('/seller', isAdmin, async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller' }).select('name role')
        res.status(200).json(sellers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/seller/:idSeller', isAdmin, async (req, res) => {
    const { idSeller } = req.params
    try {
        const user = await User.findById(idSeller).lean()
        const orders = await Order.find({seller: user._id}).populate('seller').populate({
            path: 'order_items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }).lean()
        orders.forEach(order => {
            let total = 0
            let commission_total = 0
            order.order_items.forEach((item) => {
            item.total = 0
            item.commission_total = item.product.commission_amount * item.quantity
            if (item.quantity < 6) {
                item.total = item.product.retail_price * item.quantity
            } else {
                item.total = item.product.wholesale_price * item.quantity
            }
            commission_total += item.commission_total
            total += item.total
        });
        order.total = total
        order.commission_total = commission_total
        });
        
        user.orders = orders

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.delete('/seller/:idSeller', isAdmin, async (req, res) => {
    const { idSeller } = req.params
    try {
        await User.findByIdAndDelete(idSeller)
        res.status(200).json('Deleted seller with sucess')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router