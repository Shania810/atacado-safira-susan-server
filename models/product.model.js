const { Schema, model } = require('mongoose')
const productSchema = new Schema({
    name: { type: String, required: [true, 'name of product is required'], lowercase: true, trim: true, unique: true },
    imageURL:{ type: String,default:'https://static.thenounproject.com/png/3674270-200.png',unique:true},
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    stock: { type: Number, default: 0 },
    commission_amount:{type:Number,required:[true,'commission amount is required']},
    price:{type:Number,default: 0,required:[true,'price is required']},
    wholesale_price: { type: Number, default: 0,required:[true,'wholesale price is required'] },
    retail_price: { type: Number, default: 0 ,required:[true,'retail price is required']},
    description: { type: String, required: [true, 'description is required'], lowercase: true, trim: true }
})
module.exports = model('Product', productSchema)