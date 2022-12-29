const { Router } = require('express')
const Category = require('../models/category.model')
const router = Router()
router.get('/category', async (req, res) => {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.post('/category', async (req, res) => {
  const category = req.body
  try {
    const newCategory = await Category.create(category)
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.delete('/category/:idCategory', async (req, res) => {
  const { idCategory } = req.params
  try {
    await Category.findByIdAndDelete(idCategory)
    res.status(200).json('Deleted Category with sucess')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
module.exports = router