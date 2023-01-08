const { Schema, model } = require('mongoose')

const clientSchema = new Schema({
    name: { type: String, required: [true, 'name is required'], lowercase: true, trim: true, unique: true },
    address: { type: String, required: [true, 'address is required'], lowercase: true, trim: true },
    phone: { type: String, required: [true, 'phone is required'], min: 8, max: 11 },
    cpf: { type: String, max: 11 },
    cnpj: { type: String, max: 14 }
})

module.exports = model('Client', clientSchema)