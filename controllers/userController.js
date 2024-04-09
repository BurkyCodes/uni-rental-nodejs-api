const Role = require("../models/Role.js")
const User = require("../models/User.js")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {CreateError} = require('../Utils/error.js')
const {CreateSuccess} = require('../Utils/success.js');

const register = async (req,res,next) => {
    const user = await User.findOne({email:req.body.email})
    if(!user){
        const searchUsername = await User.findOne({userName:req.body.userName})
    if(!searchUsername){
    const role = await Role.find({role:"User"});
    const salt = await bcrypt.genSalt(10);
    const hashPassword =  await bcrypt.hash(req.body.password,salt);

    const newUser = new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        userName:req.body.userName,
        email:req.body.email,
        password:hashPassword,
        roles:role
    })
    await newUser.save();
    return res.status(200).json("User registered successfully")
   }else{
    return res.status(404).json("Username already exists") 
}
}
return res.status(404).json("User already registered")
}

const registerAdmin = async (req,res,next) => {
    const user = await User.findOne({email:req.body.email})
    if(!user)
    {
        const searchUsername = await User.findOne({userName:req.body.userName})
        if(!searchUsername){
        const role = await Role.find({});
        const salt =  await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            userName:req.body.userName,
            email:req.body.email,
            password:hashPassword,
            isAdmin:true,
            roles:role,
        })
        await newUser.save();
        return next(CreateSuccess(200,"Admin Registered Successfully!!"))
        }else{
            return res.status(404).json("Username already exists") 
        }
    }
    
    return res.status(404).json("User already registered")
}

const login = async (req,res,next) => {
    try {
       
        const user = await User.findOne({email:req.body.email})
                    .populate("roles","role");
        if(!user){
            return next(CreateError(404,"User not found!!"))
        }
        
        const IsPasswordCorrect = await bcrypt.compare(req.body.password,user.password);
        if(!IsPasswordCorrect){
            return next(CreateError(400,"Password is incorrect!!"))
        }
        res.send(generateToken(user));
        // const token = jwt.sign(
        //     {id:user._id,isAdmin:user.isAdmin},
        //     process.env.JWT_SECRET 
        // )
        // res.cookie("university_rental_access_token",token,{httpOnly:true})
        //     .status(200)
        //     .json({
        //         status:200,
        //         message:"Login Success",
        //         data:user
        //     })
    } catch (error) {
        return next(CreateError(500,error))
    }

}

const loginAdmin = async (req,res,next) => {
    try {
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return next(CreateError(404,"User not found!!"))
        }
        const IsPasswordCorrect = await bcrypt.compare(req.body.password,user.password);
        if(!IsPasswordCorrect){
            return next(CreateError(400,"Password is incorrect!!"))
        }
        const isAdmin = user.isAdmin === true;
        if(!isAdmin){
            return next(CreateError(401,"You are not authorized to access this resource!"))
        }
        res.send(generateToken(user));
        
    } catch (error) {
        return next(CreateError(500,error))
    }
}
const generateToken = (user) => {
    const token = jwt.sign({
        id:user._id,
        email:user.email,
        password:user.password
    },process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
    user.token = token
    return user;
}


 const deleteUser = async(req,res,next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById({_id:userId})
        if(!user)
        {
            return next(CreateError(404,"User not found!!"))
        }
        await User.findByIdAndDelete(userId)
        return next(CreateSuccess(200,"User deleted successfully!!"))
    } catch (error) {
        return next(CreateError(500,"Server Breakdown"))
    }
}

 const getUsers = async (req,res,next) => {
    try {
        const users = await User.find({})
        if(users){
            return next(CreateSuccess(200,users))
        }else{
            return next(CreateError(404,"No Users found!!"))
        }
    } catch (error) {
        return next(CreateError(500,"Server Breakdown")) 
    }
}

module.exports = {getUsers,register,registerAdmin,deleteUser,login,loginAdmin}
