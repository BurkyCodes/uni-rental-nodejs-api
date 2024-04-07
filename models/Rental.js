const mongoose = require('mongoose');

const LatLngSchema = new mongoose.Schema(
    {
        lat:{type:String,required:true},
        lng:{type:String,required:true}
    },
    {
        _id:false
    }
);
const rentalSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    rentalImage:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    ownersName: {
        type: String,
        required: true
    },
    amenities: [{
        type: String
    }],
    // altImages: [{
    //     altImage: String
    // }],
    available: {
        type: Boolean,
        required: true
    },
    // latitude: {
    //     type: String,
    //     required: true
    // },
    // longitude:{
    //     type: String,
    //     required: true
    // },
    latlng:{
        type:LatLngSchema,
        required:true
    },
    rental_review:[{
     type:[mongoose.Schema.Types.ObjectId],
     ref:'review'
    },
  
    ]
})

module.exports = mongoose.model('rental',rentalSchema)