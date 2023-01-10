const { Router } = require("express");
const Order = require('../models/order.model')
const router = Router() 

router.get('/profit',async(req,res)=>{
    const now = new Date()
    const dateNow = now.getDate()
    const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']

   try {
    const orders = await Order.find().sort({createdAt: -1}) .populate({
        path: 'order_items',
        populate:{
            path: 'product',
            model: 'Product'
        }}).lean()
    orders.forEach(order => {
      order.date = order.createdAt.getDate().toString() +' '+ months[order.createdAt.getMonth()] + ' ' + order.createdAt.getFullYear().toString() 
        let totalWithPrice = 0
        let total = 0
            order.order_items.forEach((item) => {
                item.total = 0
                item.totalWithPrice = item.product.price * item.quantity
                if (item.quantity < 6) {
                    item.total = item.product.retail_price * item.quantity
                } else {
                    item.total = item.product.wholesale_price * item.quantity
                }
                total += item.total
                totalWithPrice += item.totalWithPrice
            });
            order.profit = total - totalWithPrice
            order.total = total   
    });
    const ordersDate = orders.map((order)=> order.date)
    const dateOrdersUnique = [...new Set(ordersDate)]

    const sumProfitByDay = (date) =>{
      const ordersFilteredByDate = orders.filter((order)=> order.date === date)
      const profitByOrder = ordersFilteredByDate.map((order)=> order.profit)
      return profitByOrder.reduce((acc,cu)=> acc + cu,0)

    }
    const profitsByDate = dateOrdersUnique.map((date)=>{return {date,profit: sumProfitByDay(date)}}) 
    res.status(200).json(profitsByDate)
   } catch (error) {
    res.status(500).json({message: error.message})
   }
})

module.exports = router