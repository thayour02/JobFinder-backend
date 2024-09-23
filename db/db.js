const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

require('dotenv').config()

const database = process.env.URI_STRING 

mongoose.connect(
database
).then(()=>console.log('database is connected')).catch((error)=> console.log("unable to connect to database",error))