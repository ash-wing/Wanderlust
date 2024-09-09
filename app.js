if(process.env.NODE_ENV != "production"){
    require('dotenv').config()

}
// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require ("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");




// const mongourl = "mongodb://127.0.0.1:27017/wanderlust"; //creating the database

const dbUrl = process.env.ATLASDB_URL


// Calling the main function
main().then(() => {
    console.log("Connected to Db");
}).catch((err) => {
    console.log(err);
});

async function main() {      //this is the main function
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//define engine for ejamate
app.engine ('ejs', ejsMate);
//use the static files
app.use(express.static(path.join(__dirname,"public")))


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:"mysupersecretcode",
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret : "mysupersecretcode",
    resave:false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
// app.get("/", (req, res) => {
//     res.send("Hi! I am root ");
// });




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate ()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User ({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })



//require all the routes
app.use("/listings", listingRouter);  
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter)


app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found"))
})

app.use((err,req, res, next)=>{
    let{statusCode=500, message="ERRORRRR"}= err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

// Uncomment if you want to add a test listing route
// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Testing successful!!");
// });
