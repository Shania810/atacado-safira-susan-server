const { Router } = require('express')
const Client = require('../models/client.model')
const isAdmin = require('../middlewares/user.middleware')
const router = Router()

router.get('/client', async (req, res) => {
    try {
        const clients = await Client.find().sort({ name: 1 })
        res.status(200).json(clients)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/client/:idClient', async (req,res) => {
    const { idClient } = req.params
    try {
        const client = await Client.findById(idClient)
        res.status(200).json(client)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/client/search/:key', async (req, res) => {
    const { key } = req.params
    try {
        let search
        if (key === 'false') {
            search = await Client.find()
        } else {
            search = await Client.find({ name: { $regex: key } })
        }
        res.status(200).json(search)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/client',isAdmin, async (req, res) => {
    const { name, address, phone, cpf, cnpj } = req.body
    try {
        let newClient
        if (cpf) {
            newClient = await Client.create({ name, address, phone, cpf })
        } else if (cnpj) {
            newClient = await Client.create({ name, address, phone, cnpj })
        }
        res.status(201).json(newClient)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/client/:idClient',isAdmin, async (req, res) => {
    const { idClient } = req.params
    const { name, address, phone, cnpj, cpf } = req.body
    try {
        let newClient
        if (cpf) {
            newClient = await Client.findByIdAndUpdate(idClient, { name, address, phone, cpf })
        } else if (cnpj) {
            newClient = await Client.findByIdAndUpdate(idClient, { name, address, phone, cnpj })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/client/:idClient',isAdmin, async (req, res) => {
    const { idClient } = req.params
    try {
        await Client.findByIdAndRemove(idClient)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router