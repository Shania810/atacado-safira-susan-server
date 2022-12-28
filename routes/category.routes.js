const {Router} = require('express')
const Category = require('../models/category.model')
const router = Router()
router.get('/category',async(req,res)=>{
    try {
      const categories = await Category.find()
      res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
module.exports = router