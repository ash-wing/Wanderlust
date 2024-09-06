const User = require("../models/user");
//render signup form
module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs")
}

//signing up
module.exports.signup = async(req, res)=>{
    try{
        let {username, email, password}= req.body;
        const newUser = new User ({email, username});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        });
        
    }
    
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

//render login form
module.exports.renderLoginForm =  (req, res)=>{
    res.render("users/login.ejs");
}

//login
module.exports.login = async(req, res)=>{
    req.flash("success","Welcome back to wanderlust !!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


//logout
module.exports.logout =  (req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you have successfully logged out");
        res.redirect("/listings");
    })
} 