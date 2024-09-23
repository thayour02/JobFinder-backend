const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const companyRoutes = require('./routes/companyRoutes')
const userRoute = require('./routes/userRoute')
const jobRoutes = require('./routes/jobRoutes')
const applicationRoutes = require('./routes/applicationRoute')
require('dotenv').config()


//database connection
require("./db/db")


const app = express()

//MIDDLEWARES
app.use(cors({origin:"http://localhost:5173", credentials:true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/api/user',authRoutes)
app.use('/api',companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoute)
app.use('/api', applicationRoutes)



const port = process.env.PORT




app.listen(port,()=>console.log(`app is running @ ${port}`))