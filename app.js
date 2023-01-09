const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./db/db.config')
const authRoutes = require('./routes/auth.routes')
const productRoutes = require('./routes/product.routes')
const categoryRoutes = require('./routes/category.routes')
const orderRoutes = require('./routes/order.routes')
const sellerRoutes = require('./routes/seller.routes')
const clientRoutes = require('./routes/client.routes')
const profitRoutes = require('./routes/profit.routes')

connectDB()
const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.use('/',authRoutes)

app.use(require('./middlewares/auth.middleware'))

app.use('/', productRoutes)
app.use('/', categoryRoutes)
app.use('/', orderRoutes)
app.use('/',sellerRoutes)
app.use('/',clientRoutes)
app.use('/',profitRoutes)

module.exports = app