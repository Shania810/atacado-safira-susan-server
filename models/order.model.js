const { Schema, model } = require('mongoose')
const orderSchema = new Schema({
   order_items: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
   }],
   seller: { type: String, lowercase: true, trim: true }
}, { timestamps: true })
module.exports = model('Order', orderSchema)