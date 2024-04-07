const express = require('express');
const {verifyToken, verifyUser} = require('../Utils/verifyToken.js');
const {createReview, getReviews, DeleteReview} = require('../controllers/reviewController.js')

const router = express.Router();


router.post("/create",verifyToken,createReview)
router.get('/:rental_id',getReviews)
router.delete('/delete/:review_id',verifyToken,DeleteReview)

module.exports = router