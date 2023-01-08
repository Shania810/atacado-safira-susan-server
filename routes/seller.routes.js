const { Router } = require('express');
const User = require('../models/user.model')
const isAdmin = require('../middlewares/user.middleware')
const router = Router()

router.get('/seller', isAdmin, async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller' })
        res.status(200).json(sellers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/seller/:idSeller', isAdmin, async (req, res) => {
    const { idSeller } = req.params
    try {
        const seller = await User.findById(idSeller)
        res.status(200).json(seller)
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