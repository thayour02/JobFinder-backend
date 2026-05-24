const cron = require("cron")
const User = require('../model/userModel')
require('dotenv').config()


const job = new cron.CronJob('*/10 * * * *', async () => {
        try {
        // Simple database query to keep connection alive
        await User.countDocuments();
        console.log('keeping the server alive')
            } catch (error) {
                console.log(error.message)
            }
});
   
  


module.exports =  { job };