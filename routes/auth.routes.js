const {Router} = require('express')
const router = Router()
const User = require('../models/user.model')
const bycrypt = require('bcrypt')

router.post('/signup',async(req,res)=>{
    const {name,password} = req.body
    if(!password || !name){
      res.status(400).json({message: 'Forneça um nome e senha válida'})
      return
    }
    const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    if(!regexPassword.test(password)){
       res.status(400).json({message: 'Senha deve ter pelo menos uma letra maiúscula, uma letra minúscula, um número,um caráter especial e deve ser no máximo 8 dígitos '})
       return
    }
    try {
      const foundedUser = await User.findOne({name: name})
      if(foundedUser){
       res.status(400).json({message: 'Usuário já existe' })
       return
      }

      const salt = bycrypt.genSaltSync(10)
      const passwordHash = bycrypt.hashSync(password,salt)

      const newUser = await User.create({name,passwordHash,role:'Seller'}) 
      res.status(201).json({_id: newUser._id,name: newUser.name,role: newUser.role})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

module.exports = router