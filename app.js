                        require("dotenv").config();
var express           = require("express"),
    app               = express(),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local"),
    flash             = require("connect-flash"),
    User              = require("./models/user"),
    Campground        = require("./models/campground"),
    Comment           = require("./models/comment"),
    methodOverride    = require("method-override");
    app.locals.moment = require('moment');
    
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");
    
mongoose.connect(process.env.DATABASEURL);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user; 
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The Yelp Camp Server has Started!");
});