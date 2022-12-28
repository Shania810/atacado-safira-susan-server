const express = require('express')
const morgan = require('morgan')
const  connectDB = require('./db/db.config')
connectDB()
const app = express()
app.use(morgan('dev'))
app.get('/',(req,res)=> res.send('deu certo'))
module.exports = app