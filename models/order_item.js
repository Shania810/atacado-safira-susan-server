const { Schema,model } = require('mongoose')
const orderItemSchema  = new Schema({
    product:{type: Schema.Types.ObjectId, ref:'Product',required: true},
    quantity:{type: Number,required: true}
})
module.exports = model(orderItemSchema,'Order Item')