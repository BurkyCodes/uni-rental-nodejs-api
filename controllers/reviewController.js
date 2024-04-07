
const { CreateError } = require('../Utils/error.js')
const Rental = require('../models/Rental.js')
const Review = require('../models/RentalReview.js')
const mongoose = require('mongoose')

const createReview = async (req,res,next) => {

    let rentalid = req.body.rentalId
   if(!mongoose.Types.ObjectId.isValid(rentalid)){
    return res.status(400).send({
        message:"Invalid rental Id"
    })
   }
   try {
    await Rental.findById({_id:rentalid}).then(async(rental) => {
        if(!rental)
        {
            return res.status(404).send({message:"No rental found"})
        }else{
            let newReview = new Review({
                review:req.body.review,
                rental_id:rentalid,
                user_id:req.user.id
            })
           
           const myreview =await newReview.save();
           Rental.updateOne(
            {_id:rentalid},
            {
                $push:{rental_review:myreview._id}
            }
            )
            return res.status(200).send({
                message:"Review added successfully",
                data:myreview
            })
        }
    })
   } catch (error) {
    res.status(500).send("Internal server error")
   }
 
}
const getReviews = async(req,res) => {
    let rentalid = req.params.rental_id
    if(!mongoose.Types.ObjectId.isValid(rentalid)){
     return res.status(400).send({
         message:"Invalid rental Id"
     })
    }

    try {
        await Rental.findById({_id:rentalid}).then(async(rental) => {
            if(!rental)
            {
                return res.status(404).send({message:"No rental found"})
            }else
            {
                // let query = [
                //     {
                //         $lookup:
                //         {
                //             from:"users",
                //             localField:"user_id",
                //             foreignField:"id",
                //             as:"user"
                //         }
                //     },
                //     {$unwind:"$user"},
                //     {
                //         $match:{
                //             "rental_id":mongoose.Types.ObjectId(rentalid)
                //         }
                //     }
                // ]
             
                let reviews = await Review.find({rental_id:rental}).populate().populate('user_id').sort({ createdAt: -1 });
                //let total = reviews.countDocuments()
                // let page = (req.query.page)?parseInt(req.query.page):1
                // let perPage = (req.query.perPage)?parseInt(req.query.perPage):5;
                // let skip = (page-1) * perPage
                //const total = await Review.countDocuments({})
               
                return res.status(200).send(reviews)
            }
        })
    } catch (error) {
        res.status(500).send("Internal server error")
    }
}
const DeleteReview = async (req,res,next) => {
    let reviewId = req.params.review_id;
    if(!mongoose.Types.ObjectId.isValid(reviewId)){
        return res.status(400).send({
            message:"Invalid review Id"
        });
       }
       Review.findById({_id:reviewId}).then(async(review) => {
        if(!review){
            return res.status(400).send({
                message:'No review found'
            })
        }
        else{
            let current_user = req.user
            if(review.user_id != current_user.id)
            {
                return res.status(400).send({
                    message:"You are not allowed to delete the comment"
                })
            }else{
                try {
                    await Review.deleteOne({_id:reviewId});
                    await Rental.updateOne(
                     {_id:review.rental_id},
                     {
                         $pull:{rental_review:reviewId}
                     }
                    )
                   return res.status(200).send({
                    message:"Cemment deleted successfully"
                   })
                } catch (error) {
                   return res.status(400).send({
                    message:error.message
                   }) 
                }
           
            }
        }
       })
}

module.exports = {createReview,getReviews,DeleteReview}