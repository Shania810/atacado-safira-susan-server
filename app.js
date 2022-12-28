const express = require('express')
const app = express()
app.get('/',(req,res)=> res.send('deu certo'))
module.exports = app