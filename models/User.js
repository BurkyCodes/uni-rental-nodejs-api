const mongoose = require('mongoose')
const {Schema}= require('mongoose')



const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    roles:{
        type:[Schema.Types.ObjectId],
        required:true,
        ref:"Role",
        default:"user"
    },
    token : {
        type:String
    }
},{timestamps:true});


module.exports = mongoose.model('users',UserSchema)