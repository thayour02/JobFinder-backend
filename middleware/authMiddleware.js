const jwt = require('jsonwebtoken')

const userAuth = async (req,res,next)=>{
    const authHeader = req?.headers?.authorization

    if(!authHeader || !authHeader?.startsWith('Bearer')){
        next('authorization failed')
    }
    const token = authHeader?.split(" ")[1];

    try {
        const userToken = jwt.verify(token,  process.env.JWT_SECRET_KEY)
        req.body.user = {
            userId : userToken.userId
        }
        next();
    } catch (error) {
        console.log(error)
        next('failed')
    }
}

module.exports = userAuth