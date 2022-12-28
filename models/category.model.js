const { Schema, model} = require('mongoose')
const categorySchema = new Schema({
    name:{type: String,required: [true,'name is required'],lowercase: true,trim: true,unique: true}
})
module.exports = model('Category',categorySchema)
