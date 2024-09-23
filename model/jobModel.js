const mongoose = require('mongoose')
const Schema = require('mongoose')

const jobSchema = new mongoose.Schema({
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    user:{type: Schema.Types.ObjectId, ref: "User" },
    application:[{type: Schema.Types.ObjectId, ref: "Application" }],
    jobTitle: { type: String },
    jobType: { type: String },
    location: { type: String },
    salary: { type: Number },
    vacancy: { type: Number, default:1
        ,min: [1, 'Vacancy must be at least 1']},
    experience: { type: Number, default: 0 },
    applicant:{type:Number, default:0},
    detail: [
        { desc: { type: String }, requirement: { type: String } }
    ],
   
},
    { timestamps: true }
)


module.exports = mongoose.model('Jobs', jobSchema)