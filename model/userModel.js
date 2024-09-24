const mongoose = require('mongoose')
const JWT = require('jsonwebtoken')
const Schema = require('mongoose')
require('dotenv').config()
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, 'First Name is required']
    },
    LastName:{
        type:String,
        required:[true, 'Last Name is required']
    },
    password:{
        type:String,
        required:[true, "Password is Required"],
        minlength:[6, "password must be atleast"],
        select:true
    },
    email:{
        type:String,
        required:[true, "Company email is Required"],
        unique:true,
    },
    accountType:{type:String,
        default:"Seeker",
        enum: ['Seeker', 'company'],
    },
  //   contact:{
  //     type:String,
  //     match: /^\+?[1-9]\d{1,14}$/
  // },
    location:{type:String},
    application:[{type: Schema.Types.ObjectId, ref: "Application" }],
    company:{ type: Schema.Types.ObjectId, ref: "Company" },
    job:{ type: Schema.Types.ObjectId, ref: "Jobs" },

    about:{type:String},
    profileUrl:{type:String},
    jobTitle:{type:String},
    userCv:{type:String},
    about:{type:String},
    lastLogin:{
        type:Date,
        default:Date.now
    },
    socialMedia: {
        twitter: {
          type: String,
          validate: {
            validator: v => /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,}$/.test(v) || !v,
            message: "Invalid Twitter URL"
          }
        },
        facebook: {
          type: String,
          validate: {
            validator: v => /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9._]{1,}$/.test(v) || !v,
            message: "Invalid Facebook URL"
          }
        },
        linkedin: {
          type: String,
          validate: {
            validator: v =>/^(https?:\/\/www\.linkedin\.com\/in\/)[a-zA-Z0-9-]+(?:\?[a-zA-Z0-9_=&]+)?$/.test(v) || !v,
            message: "Invalid LinkedIn URL"
          }
        },
        portfolio: {
          type: String,
          validate: {
            validator: v => /^(https?:\/\/)[a-zA-Z0-9._]{1,}$/.test(v) || !v,
            message: "Invalid portfolio URL"
          }
        },
        github: {
            type: String,
            validate: {
              validator: v => /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9._]{1,}$/.test(v) || !v,
              message: "Invalid GitHub URL"
            }
      
      },
    },
    
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken: String,
    resetPasswordExpireAt:Date,
    EmailVerificationToken:String,
    EmailVerificationTokenExpireAt:Date
},{timestamps:true}
)


userSchema.methods.createJWT = async function(userId){
    const token = JWT.sign(
        {userId:this._id},
         process.env.JWT_SECRET_KEY,{
            expiresIn:'14d'
        });
        return token
}

module.exports = mongoose.model('User', userSchema)