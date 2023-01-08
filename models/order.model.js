const { Schema, model } = require('mongoose')
const orderSchema = new Schema({
   client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
   order_items: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
   }],
   seller: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })
module.exports = model('Order', orderSchema)