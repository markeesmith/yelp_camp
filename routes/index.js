var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

// Route Route
router.get("/", function(req, res){
    res.render("landing"); 
});

// Register Form Route
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'}); 
});

// Register Post Route
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
             return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Login Form Route
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

// Login Post Route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

// Logout Form Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have successfully logged out");
    res.redirect("/campgrounds");
});

module.exports = router;