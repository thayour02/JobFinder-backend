import https from 'https';
import cron from "cron";
import "dotenv/config";



const job = new cron.CronJob("*/14 * * * *", function() {
    https
    .get(process.env.API_URL, (res)=>{
        if(res.statusCode === 200)console.log("GET request sent succesfully");
        else console.log("Error in GET request", res.statusCode, res.statusMessage);
    })
    .on("error", (e)=>{
        console.log("Error sending GET request", e);
    })

})

export default job;