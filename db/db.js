const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

require('dotenv').config()

const database = process.env.URI_STRING 

mongoose.connect(
database
).then(()=>{
   console.log("Database connected successfully")
}).catch((error)=> {
    console.error("Database connection failed:", error.message);
    process.exit(1);
})