const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const  connectDB = require('./db/db.config')
const productRoutes = require('./routes/product.routes')
connectDB()
const app = express()
app.use(morgan('dev'))
app.use(cors())
app.get('/',(req,res)=> res.send('deu certo'))
app.use('/',productRoutes)
module.exports = app