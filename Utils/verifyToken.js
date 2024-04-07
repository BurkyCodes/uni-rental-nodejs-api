const jwt = require('jsonwebtoken')
const {CreateError} = require('./error.js')

const verifyToken = (req,res,next) => {
    const token  = req.headers['authorization'];
    if(!token) {
        return next(CreateError(401,"You are not authenticated"));
    }
   var decoded =  jwt.verify(token, process.env.JWT_SECRET)
   if(decoded)
   {
    req.user = decoded
   }else{
    return next(CreateError(401,"Please login to continue"));
   }
   next()
}

 const verifyUser = (req,res,next) => {
    verifyToken(req,res, () => {
        if(req.user._id === req.params.id || req.user.isAdmin)
        {
            next();
        }
        else{
            return next(CreateError(403,"You are not authorized"))
        }
    })
}


 const verifyAdmin = (req,res,next) => {
    verifyToken(req,res, () => {
        console.log(req.user)
        if(req.user.isAdmin)
        {
            next();
        }
        else{
            return next(CreateError(403,"You are not authorized"))
        }
    })
}

module.exports = {verifyAdmin,verifyUser,verifyToken}