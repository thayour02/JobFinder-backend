const mongoose = require('mongoose')
const Schema = require('mongoose')

const applicationSchema = new mongoose.Schema({
    user:{type: Schema.Types.ObjectId, ref:'User', require:true},
    job:{type: Schema.Types.ObjectId, ref:'Jobs', require:true},
    company:{type: Schema.Types.ObjectId, ref:"Company", require:true},
    status: {
        type: String,
        enum: ['pending', 'Approved', 'Rejected'],
        default:'pending'

    },
    resume:{type:String},
    coverLetter:{type:String},
    appliedAt:{type:Date, default:Date.now},

})

module.exports = mongoose.model('Application', applicationSchema)