const { Schema, model} = require('mongoose')
const productSchema = new Schema({
    name:{type: String,required: [true,'name of product is required'],lowercase: true,trim: true,unique: true},
    category:{type: Schema.Types.ObjectId, ref: 'Category',required: true},
    stock:{type: Number,default: 0},
    price:{type: Number,default:0},
    description:{type: String,required: [true,'description is required'],lowercase: true,trim: true}
})
module.exports = model(productSchema,'Product')