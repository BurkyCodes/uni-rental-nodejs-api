const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    review:{
        type:String,
        required:true
    },
    rental_id:{
        type:[mongoose.Schema.Types.ObjectId],  
        ref:'rental'
    },
    user_id:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'users'},
},{timestamps:true})

module.exports = mongoose.model('review',reviewSchema)