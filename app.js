const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const  connectDB = require('./db/db.config')
const productRoutes = require('./routes/product.routes')
const categoryRoutes = require('./routes/category.routes')
connectDB()
const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=> res.send('deu certo'))
app.use('/',productRoutes)
app.use('/',categoryRoutes)
module.exports = app