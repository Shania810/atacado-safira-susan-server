const { Router } = require('express')
const Product = require('../models/product.model')
const Category = require('../models/category.model')
const Order = require('../models/order.model')
const isAdmin = require('../middlewares/user.middleware')
const router = Router()

router.get('/product', async (req, res) => {
    try {
        const products = await Product.find().populate('category')
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/productFiltered/:idCategory', async (req, res) => {
    const { idCategory } = req.params
    try {
        const products = await Product.find({ category: idCategory }).populate('category')
        res.status(200).json(products)
    } catch (error) {

    }
})
router.get('/product/:idProduct', async (req, res) => {
    const { idProduct } = req.params
    try {
        const product = await Product.findById(idProduct).populate('category')
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/product/search/:key', async (req, res) => {
    const { key } = req.params
    try {
        let search
        if (key === 'false') {
            search = await Product.find().populate('category')
        } else {
            search = await Product.find({ name: { $regex: key } })
        }
        res.status(200).json(search)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.post('/product', isAdmin, async (req, res) => {
    const product = req.body
    try {
        const category = await Category.findOne({ name: product.category })
        const newProduct = await Product.create({ ...product, category: category._id })
        res.status(201).json(newProduct)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.put('/product/stock/:idOrder', async (req, res) => {
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
            const product = await Product.findById(item.product._id)
            await Product.findByIdAndUpdate(item.product._id, { stock: product.stock - item.quantity })
        }
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.put('/product/:idProduct', isAdmin, async (req, res) => {
    const { idProduct } = req.params
    const { name, category, retail_price, wholesale_price, stock, description,commission_amount } = req.body
    const update = {}
    if (name) update.name = name
    if (retail_price) update.retail_price = retail_price
    if (wholesale_price) update.wholesale_price = wholesale_price
    if (stock) update.stock = stock
    if (description) update.description = description
    if(commission_amount) update.commission_amount = commission_amount
    try {
        let updatedProduct
        if (category) {
            category = await Category.findOne({ name: category })
            updatedProduct = await Product.findByIdAndUpdate(idProduct, { ...update, category: category._id }, { new: true })
        } else {
            updatedProduct = await Product.findByIdAndUpdate(idProduct, update, { new: true })
        }
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.delete('/product/:idProduct', isAdmin, async (req, res) => {
    const { idProduct } = req.params
    try {
        await Product.findByIdAndRemove(idProduct)
        res.status(200).json('deleted with sucess')
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router