const express=require('express');
const router= express.Router({mergeParams: true});
const wrapAsync= require('../utils/wrapAsync.js');
const {validateReview, isLoggedIn, isReviewAuthor}= require('../middleware.js');

const reviewController= require('../controllers/reviews.js');

//Review route
router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete reviews route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));


module.exports=router;