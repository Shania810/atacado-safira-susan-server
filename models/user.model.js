const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    name: { type: String, required: [true, 'name is required'], trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: [true, 'passwordHash is required'] },
    role: { type: String, required: [true, 'role is required'], trim: true, lowercase: true }
})

module.exports = model('User', userSchema)