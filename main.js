"use strict";

const 
// require express module
express = require("express"),
// The express webserver application is instantiated and stored
// in a constant to be referred to as app
app = express(),
  mongoose = require("mongoose"),
  // method-override is middleware that interprets requests according to a specific query 
  // parameter and HTTP method. With the _method=PUT query parameter, you can interpret 
  // POST requests as PUT requests
  methodOverride = require("method-override"),

  // You need the express-session module to pass messages between your application and
  // the client. These messages persist on the user’s browser but are ultimately 
  // stored in the server.
  expressSession = require("express-session"),
  // you need the cookie-parser package to indicate that you want to use cookies and 
  // that you want your sessions to be able to parse (or decode) cookie data sent back
  // to the server from the browser.
  // You tell your Express.js application to use cookie-parser as middleware and to use 
  // some secret passcode you choose. cookie-parser uses this code to encrypt your data 
  // in cookies sent to the browser.
  cookieParser = require("cookie-parser"),
  // Use the connect-flash package to create your flash messages. This package is 
  // dependent on sessions and cookies to pass flash messages between requests.
  Flash = require("connect-flash"),

  expressValidator = require("express-validator"),
// Require the passport module, Passport.js uses methods called strategies for
//users to log in. The local strategy refers to the username and password login 
// method.
  passport = require("passport"),

	LocalStrategy = require("passport-local"),
 // Generates a breadcrumb array from the current URL and exposes to views 
 // via a breadcrumb variable.
 // show the path below the main menu - in each page in opportunities options 
  breadcrumb=require("express-url-breadcrumb"),
	  

  // require controllers
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),

  //subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  //coursesController = require("./controllers/coursesController"),
  User = require("./models/user");

// require routes

const indexRoutes = require("./routes/index"),
      userRoutes =  require("./routes/userRoutes"),
      opportunitiesindexRoutes = require("./routes/opportunitiesindexRoutes"),
      errorRoutes =  require("./routes/userRoutes");


// Mongoose will support my promise chains  
mongoose.Promise = global.Promise;
// Add Mongoose connection to Express.js
mongoose.connect(
// Set up the connection to your database.  
  //"mongodb://localhost:27017/AAFWEB_db",
  "mongodb://0.0.0.0:27017/AAFWEB_db",
  {// useNewUrlParser: true , // not longer neccesary
	// useFindAndModify: false } // not longer neccesary
  });
//mongoose.set("useCreateIndex", true); // not longer neccesary
// Assign the database to the db variable.
const db = mongoose.connection;

// Log a message when the application connects to the database.
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// Multer setup - Multer es un middleware para Express y Node.js que hace que sea fácil 
// manipular este multipart/form-data cuando tus usuarios suben archivos a traves 
// de un formulario - imagenes and videos
const multer = require('multer');

let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

//exports adminId = "63f54653795f1425c4874e5a";





// set up the aplication to listen on port 3001
app.set("port", process.env.PORT || 3001);
// This line tells your Express.js application to set its view engine as ejs
app.set("view engine", "ejs");

// enable the serving of static files include your assets and custom error pages, 
// such as 404.html and 500.html
// tells your application to use the corresponding public folder, at
// the same level in the project directory
app.use(express.static("public"));

// Capturing posted data from the request body
// analyze incoming request bodies use of req.body
// To easily parse the body of a request, you need the help of the express.json and
// express.urlencoded middleware function. These modules act as middleware between 
// your request being received and processed fully with Express.js.
app.use(express.urlencoded({extended: false}));
// analyze incoming request bodies use of req.body
// specify that you want to parse incoming requests that are URL-encoded 
// (usually, form post and utf-8 content) and in JSON format
app.use(express.json());
// Tell the application to use methodOverride as middleware
// method-override is middleware that interprets requests according to a specific query
// parameter and HTTP method. With the _method=PUT query parameter, you can interpret
// POST requests as PUT requests

app.use(methodOverride("_method", { methods: ["POST", "GET"]}));

//you have your application use sessions by telling express-session to use cookie-parser 
// as its storage method and to expire cookies after about an hour.
app.use(cookieParser("secret_passcode"));
app.use(expressSession({
    secret: "secret_passcode", // You also need to provide a secret key to encrypt your session data.
    cookie: {
      maxAge: 4000000
    },
    resave: false, // Also specify that you don’t want to update existing session
                   // data on the server if nothing has changed in the existing session
    saveUninitialized: false // Specify that you don’t want to send a cookie to the 
                             // user if no messages are added to the session
  })
);
// initialize the passport module and have your Express.js app use it
app.use(passport.initialize());
// Configure passport to use sessions in Express.js.
// passport.session tells passport to use whatever sessions you’ve already set up 
// with your application.
app.use(passport.session());
// set up your login strategy on the user model and tell passport to handle
// the hashing of user data in sessions for you
passport.use(User.createStrategy());
// Set up passport to serialize and deserialize your user data.
// These lines direct the process of encrypting and decrypting user data stored in sessions.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// have the application use connect-flash as middleware.
app.use(Flash());

// you can add messages to req.flash at the controller level and access 
// the messages in the view through flashMessages.
// add locals var to the index view
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
  res.locals.adminId = process.env.adminId;
  res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use(expressValidator());

// Generates a breadcrumb array from the current URL and exposes to 
// views via a breadcrumb variable.

app.use(breadcrumb());
// This code tells your Express.js application to use the router object as 
// a system for middleware and routing.


//app.use(errorController.logErrors);
// Handle missing routes and errors with custom messages
// Add error-handling middleware to main
//app.use(errorController.respondNoResourceFound);
//app.use(errorController.respondInternalError);



app.use("/",indexRoutes);






app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
