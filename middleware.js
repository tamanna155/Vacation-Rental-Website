const {listingSchema} =require('./Schema.js');
const {reviewSchema} =require('./Schema.js');
const listing= require('./models/listing.js');
const review= require('./models/review.js');
const ExpressError=require('./utils/ExpressError.js');


module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect('/login');
    }
    next();
};

module.exports.validateListing = (req,res,next) =>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errorMsg);
    } else{
        next();
    }
};

module.exports.saveRedirectUrl= (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async (req,res,next) =>{
    let {id}=req.params;
    let list=await listing.findById(id);
    if(!list.owner.equals(res.locals.currUser._id)){
        req.flash('error',"You don't have the permission.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateReview=(req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    } else{
        next();
    }
};

module.exports.isReviewAuthor= async(req,res,next) =>{
    let{id,reviewId} = req.params;
    let list= await review.findById(reviewId);
    if(!list.author.equals(res.locals.currUser._id)){
        req.flash('error',"You don't have the permission to delete the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}