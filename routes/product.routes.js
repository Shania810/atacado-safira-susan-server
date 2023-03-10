const { Router } = require('express')
const Product = require('../models/product.model')
const Category = require('../models/category.model')
const Order = require('../models/order.model')
const isAdmin = require('../middlewares/user.middleware')
const uploadCloud = require('../config/config.cloudinary')
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
        res.status(500).json({message: error.message})
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
    const {name,stock,commission_amount,price,wholesale_price,retail_price,description,category} = req.body
    const commissionAmount = parseFloat(commission_amount).toFixed(2)
    const priceBrought = parseFloat(price).toFixed(2)
    const wholesalePrice = parseFloat(wholesale_price).toFixed(2)
    const retailPrice = parseFloat(retail_price).toFixed(2)

    try {
        const categoryFounded = await Category.findOne({name: category})
        const newProduct = await Product.create({ name,stock,commission_amount: commissionAmount,price: priceBrought,wholesale_price: wholesalePrice,retail_price: retailPrice,description, category: categoryFounded._id })
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
    const update = req.body
    try {
        let updatedProduct
        if (update.category) {
            const category = await Category.findOne({ name: update.category })
            updatedProduct = await Product.findByIdAndUpdate(idProduct, { ...update, category: category._id }, { new: true })
        } else {
            updatedProduct = await Product.findByIdAndUpdate(idProduct, update, { new: true })
        }
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/product/:idProduct/upload-image',isAdmin,uploadCloud.single('image'),async(req,res)=>{
  const {idProduct} = req.params
   try {
    const updatedProduct = await Product.findByIdAndUpdate(idProduct,{imageURL: req.file.path},{new: true})
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).json(error.message)
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