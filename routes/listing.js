const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");  // Renamed to Listing
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");




//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});  //connect and find
    res.render("listings/index.ejs", { allListings }); //rendering the list in the website
}));


//New route
//Create new listing route CREATE ONLY
router.get("/new",isLoggedIn, (req, res)=>{
    
    //we are rendering a new form in create new page
    res.render("listings/new.ejs")
    
})

//show route
// Show request route SHOW
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params; //pick your id 
    //now find the id in database
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");  // Using the renamed model
    if(!listing){
        req.flash("error", "listing doesnt exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });  // Render it accordingly
}));

//Create route
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
        // throw new ExpressError(400, "send valid data for listing")
    // }
    const newListing = new Listing(req.body.listing); // Create a new Listing instance with the form data
    // if(!newListing.title){
    //     throw new ExpressError(400, "give title")

    // }
    // if(!newListing.description){
    //     throw new ExpressError(400, "give description")

    // }
    // if(!newListing.location){
    //     throw new ExpressError(400, "give location")

    // }
    newListing.owner = req.user._id;
    await newListing.save(); // Save the new listing to the database
    req.flash("success", "New listing created")
    res.redirect("/listings"); // Redirect to the listings page after successful creation
}));



//edit route

//--update route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req, res)=>{ //edit page
    let {id} = req.params;                        //picking that particular list name
    const listing = await Listing.findById(id);   //find it 
    if(!listing){
        req.flash("error", "listing doesnt exist");
        res.redirect("/listings");
    }
    res.render ("listings/edit.ejs", {listing})  //render the edit form  for that specific list name id 
}));

//update route
//update route using PUT request
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync( async(req, res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing")
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstructing to individual values for editing
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`); //redirect to action page

}));

//DELETE Route 
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async(req, res)=>{
    let{id} = req.params; //pick the id
    const deletedlist = await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success", "listing deleted")

    res.redirect("/listings");
}));

module.exports = router;

