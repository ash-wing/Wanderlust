const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});  //connect and find
    res.render("listings/index.ejs", { allListings }); //rendering the list in the website
}

//new route
module.exports.renderNewForm = (req, res)=>{
    
    //we are rendering a new form in create new page
    res.render("listings/new.ejs")
    
}

//show route 
module.exports.showListing = async (req, res) => {
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
}


//create 
module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()
        




    let url  = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing); // Create a new Listing instance with the form data
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    
    newListing.geometry = response.body.features[0].geometry;


    let savedListing = await newListing.save(); // Save the new listing to the database
    console.log(savedListing);
    req.flash("success", "New listing created")
    res.redirect("/listings"); // Redirect to the listings page after successful creation
}

//edit form
module.exports.renderEditForm = async(req, res)=>{ //edit page
    let {id} = req.params;                        //picking that particular list name
    const listing = await Listing.findById(id);   //find it 
    if(!listing){
        req.flash("error", "listing doesnt exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/e_blur:200,h_300,w_250");


    res.render ("listings/edit.ejs", {listing,originalImageUrl})  //render the edit form  for that specific list name id 
}

//update
module.exports.updateListing =  async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstructing to individual values for editing
    
    if(typeof req.file !== "undefined"){
        let url  = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`); //redirect to action page

}

//delete
module.exports.destroyListing = async(req, res)=>{
    let{id} = req.params; //pick the id
    const deletedlist = await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success", "listing deleted")

    res.redirect("/listings");
}