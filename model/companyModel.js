const mongoose = require('mongoose')
const Schema = require('mongoose')
const JWT = require('jsonwebtoken')


const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Company Name is Required"]
    },
    email:{
        type:String,
        required:[true, "Company email is Required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true, "Password is Required"],
        minlength:[6, "password must be atleast"],
        select:true
    },
    contact:{
        type:String,
        match: /^\+?[1-9]\d{1,14}$/
    },
    location:{type:String},
    about:{type:String},
    profileUrl:{type:String},
    jobPosts:[{ type:Schema.Types.ObjectId, ref:"Jobs"}],
    lastLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    job:{type:Schema.Types.ObjectId, ref:"Company"},
    user:{ type: Schema.Types.ObjectId, ref: "User" },
    application:{ type: Schema.Types.ObjectId, ref: "Application" },
    url: {
        type: String,
        match: /^(https?:\/\/)?([\w\-]+\.)*([\w\-]+\.[\w]{2,})([\/\w \.-]*)*\/?$/
    },
    resetPasswordToken: String,
    resetPasswordExpireAt:Date,
    EmailVerificationToken:String,
    EmailVerificationTokenExpireAt:Date
},
{timestamps:true}
)

// password hashing

// companySchema.pre('save', async function(){
//     if(!this.isModified) return

//     const salt = await bcrypt.genSalt(10)

//     this.password = await bcrypt.hash(this.password, salt)
// })

// compare password 

// companySchema.methods.comparePassword = async function(companyPassword){

//     const isMatch = await bcrypt.compare(companyPassword, this.password)

//     return isMatch;
    
// }
// JWT TOKEN
companySchema.methods.createJWT = function (){
    const token = JWT.sign({ userId:this._id},process.env.JWT_SECRET_KEY, {
            expiresIn:'7d'
        });

        // res.cookie('token', token,{
        //     httpOnly:true,
        //     secure:process.env.NODE_ENV === "production",
        //     sameSite:"strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // })
        return token;
};

module.exports = mongoose.model('Company', companySchema)