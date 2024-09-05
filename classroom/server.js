const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  



const sessionOptions = {
    secret: "mysupersecretstring",
    resave:false, 
    saveUninitialized: true

}
app.use(session(sessionOptions));
app.use(flash()); //used flash

//using middleware
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    next();
})


app.get("/register", (req, res)=>{
    let{name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("failure", "user registration failed");

    }
    else{
        req.flash("success", "user registered successfully");


    }

    res.redirect("/hello");
});

app.get("/hello", (req, res)=>{
    // console.log(req.flash("success"));
    res.render("page.ejs", {name: req.session.name})
    // res.send(`hello, ${req.session.name}`)
})

// app.get("/test", (req, res)=>{
//     res.send("test successful")
// })
// app.get("/reqcount", (req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;

//     }
//     res.send(`You sent a req ${req.session.count} times`);
// });





// app.use(cookieParser("secretcode"));


// app.get("/getsignedcookies", (req, res)=>{
//     res.cookie("greet", "hello", {signed : true})
//     res.send("signed cookie sent")
// });

// app.get("/verify", (req, res)=>{
//     console.log(req.signedCookies);
//     res.send("verified")
// })
// //sending cookies
// app.get("/getcookies", (req, res)=>{
//     res.cookie("greet", "hello")  //name value pair
//     res.send("have some cookies")
// })

// app.get("/greet", (req, res)=>{
//     let{name = "ghost"} = req.cookies;
//     res.send(`hi ${name}`)
// })

// app.get("/", (req, res)=>{
//     console.dir(req.cookies);
//     res.send ("Hi i am root")
// })

// app.use("/users", users);
// app.use("/posts", posts)




app.listen(3000, ()=>{
    console.log("server is listning to port 3000")
})