const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const companyRoutes = require('./routes/companyRoutes')
const userRoute = require('./routes/userRoute')
const jobRoutes = require('./routes/jobRoutes')
const applicationRoutes = require('./routes/applicationRoute')
const { job } = require('./middleware/cron.js')
const errorHandler = require('./middleware/errorHandler')
const { 
    securityHeaders, 
    sanitizeMongo, 
    sanitizeXSS, 
    requestSizeLimit,
    generalLimiter 
} = require('./middleware/security')
require('dotenv').config()


//database connection
require("./db/db")


const app = express()

//MIDDLEWARES
app.use(cors({
    origin:"https://thayourjobfinderapp.netlify.app", 
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    maxAge: 3600, // Optional, specifies CORS configuration cache duration
  }))
  
job.start()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/user',authRoutes)
app.use('/api',companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoute)
app.use('/api', applicationRoutes)

// Error handling middleware
app.use(errorHandler)



const port = process.env.PORT



app.listen(port,()=>{
    // Server started successfully
    console.log(`Server is running on port ${port}`)
    })