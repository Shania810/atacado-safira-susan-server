const { Schema, model} = require('mongoose')
const orderSchema = new Schema({
   order_items:[{type: Schema.Types.ObjectId,ref:'Item'}],
   seller:{type: String}
},{timestamps: true})
module.exports = model('Order',orderSchema)