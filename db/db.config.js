const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const connectDB = async () => {
   try {
      mongoose.set("strictQuery", false);
      const connection = await mongoose.connect(process.env.MONGO_URI)
      console.log(connection.connections[0].name)
   } catch (error) {
      console.log(error.message)
   }
}
module.exports = connectDB