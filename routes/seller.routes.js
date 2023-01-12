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
        const orders = await Order.find({seller: user._id}).populate('client seller').populate({
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
                item.total = parseFloat(item.product.retail_price * item.quantity).toFixed(2)
            } else {
                item.total = parseFloat(item.product.wholesale_price * item.quantity).toFixed(2)
            }
            commission_total += item.commission_total
            total += item.total
        });
        order.total = parseFloat(total).toFixed(2)
        order.commission_total = parseFloat(commission_total).toFixed(2)
        });
        user.orders = orders

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/seller/:idSeller/commission',isAdmin,async(req,res)=>{
    const { idSeller } = req.params
    const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
    
    try {
        const user = await User.findById(idSeller).lean()
        const orders = await Order.find({seller: user._id}).sort({createdAt: -1}).populate({
            path: 'order_items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }).lean()
        orders.forEach(order => {
            let commission_total = 0
            order.order_items.forEach((item) => {
            item.commission_total = parseFloat(item.product.commission_amount * item.quantity).toFixed(2)
            commission_total += item.commission_total 
        });
        order.date = order.createdAt.getDate().toString() + ' ' + months[order.createdAt.getMonth()] + ' ' + order.createdAt.getFullYear().toString()
        order.commission_total = parseFloat(commission_total).toFixed(2)
        });

        const ordersDate = orders.map((order)=> order.date)
        const dateOrdersUnique = [...new Set(ordersDate)]

        const sumCommissionByDay = (date) =>{    
            const ordersFilteredByDate = orders.filter((order)=> order.date === date)
            const commissionByOrder = ordersFilteredByDate.map((order)=> order.commission_total)
            const sumCommissionsByOrder =  commissionByOrder.reduce((acc,cu)=> acc + cu,0)
            return parseFloat(sumCommissionsByOrder).toFixed(2)
          }
          const commissionsByDate = dateOrdersUnique.map((date)=>{return {date,commission: sumCommissionByDay(date)}}) 

        res.status(200).json(commissionsByDate)
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