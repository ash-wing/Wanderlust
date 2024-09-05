const Listing = require("./models/listing");
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.user);
    if(req.isUnauthenticated()){
        req.session.redirectUrl = req.originalUrl;
        if(req.params.id){
            req.session.listingId = req.params.id;
            req.flash("error", "You must be logged in to edit the review");

        }else{
            console.log(req.params);
            req.flash("error", "You must be logged in to create new listing");
            
        }
        return res.redirect("/login");
        
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        if(req.session.listingId){
            res.locals.redirectUrl = `/listings/${req.session.listingId}`;
            console.log(res.locals.redirectUrl);
        }else{
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        // console.log(req.session.redirectUrl);
    }
    next();
}


module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "you dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//schema validation
module.exports.validateListing = (req, res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

}

//review validation
module.exports.validateReview =(req, res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

};  

module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you did not create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};