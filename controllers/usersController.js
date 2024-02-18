"use strict";

const 

// require express module
express = require("express"),
mongoose = require("mongoose"),
expressSession = require("express-session"),
  app=express(),
  User = require("../models/user"),
  passport = require("passport"),
  async = require("async"),
  nodemailer = require("nodemailer"),
  crypto = require("crypto"),
  // Use the connect-flash package to create your flash messages. This package is 
  // dependent on sessions and cookies to pass flash messages between requests.
  Flash = require("connect-flash"),


  // This function is reused throughout the controller to organize user attributes 
  // in one object. You should create the same functions for your other model controllers.
  getUserParams = body => {
    return {
      username: body.username,
      name: body.name,
      password: body.password,
    };
  };

  // have the application use connect-flash as middleware.
app.use(Flash());
console.log("Estoy en usersController");
// Export object literal with all controller actions.
module.exports = {
  index: (req, res, next) => {
    User.find()
      .then(users => {
         // Send saved data to the next then code block.
         // Store the user data on the response and call the next middleware function.
        //res.locals.usersname = usersname;
        //res.locals.username = username;
        res.locals.users=users
        
        next();
      })
      // Log error messages and redirect to the home page.
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    // Render the index page with an array of users.
    res.render("users/index");
  },
  
  // Add the new action to render a form.
  new: (req, res) => {
    console.log("estoy en userscontoller")
    res.render("users/register");
  },
  // create action, assign a userParams variable to the collected incoming data.
  create: (req, res, next) => {
    if (req.skip) return next();
    let newUser = new User(getUserParams(req.body));

    User.register(newUser, req.body.password, (error, user) => { // Register new users.
      if (user) {
    // Respond with a success flash message.    
        req.flash("success", `${user.fullName}'s account created successfully!`);
        res.locals.redirect = "/";
        next();
      } else {
     // Respond with a error message.   
        req.flash("error", `Failed to create user account because: ${error.message}.`);
        res.locals.redirect = "/register";
        next();
      }
    });
  },
  // redirectView, determines which view to show based on the redirect path it 
  // receives as part of the response object
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  // Show action for a specific user

  show: (req, res, next) => {
  // First, collect the user’s ID from the URL parameters; you can get 
  // that information from req.params.id.  
    let userId = req.params.id;
  // Use the findById query, and pass the user’s ID  
    User.findById(userId)
  // Because each ID is unique, you should expect a single user in return  
      .then(user => {
  // If a user is found, add it as a local variable on the response object   
  // Pass the user through the response object to the next middleware function.   
        res.locals.user = user;
  // and call the next middleware      
        next();
      })
  // If an error occurs, log the message, and pass the error to the next
  // middleware function.    
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  // render the show page and pass the user object to display that
  // user’s information.
  showView: (req, res) => { 
    res.render("users/show"); // Render show view.
  },
  // Adding edit and update actions
  // Add the edit action.
  edit: (req, res, next) => {
    let userId = req.params.id;
  // Use findById to locate a user in the database by their ID.  
    User.findById(userId)
      .then(user => {
  // Render the user edit page for a specific user in the database.
        res.render("users/edit", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  // use some Mongoose methods in a specific update action
  // Add the update action.
  update: (req, res, next) => {
    let userId = req.params.id,
  // Collect user parameters from request.  
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last
        },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode
      };
  // Use findByIdAndUpdate to locate a user by ID and update the document record in one command.    
    User.findByIdAndUpdate(userId, {
  // This method takes an ID followed by parameters you’d like to replace for that document
  //  by using the $set command    
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
  // Add user to response as a local variable, and call the next middleware function.
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },
  // Deleting users with the delete action
  delete: (req, res, next) => {
    let userId = req.params.id;
  // using the Mongoose findByIdAndRemove method to locate the record you clicked
  // and remove it from your database  
    User.findByIdAndRemove(userId)
  // If you’re successful in locating and removing the
  // document log that deleted user to the console and redirect in the next 
  // middleware function to the users index page
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
  // Otherwise, log the error as usual, and let your error handler
  // catch the error you pass it.
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
  login: (req, res) => {
    
    res.render("users/login");
  },
// Call on passport to authenticate a user via the local strategy.
  authenticate: passport.authenticate("local", {
 // Set up success and failure flash messages and redirect
 // paths based on the user’s authentication status.   
    failureRedirect: "/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
  }),

  // The first validation function uses the request and response, and it may 
  // pass on to the next function in the middleware chain, so you need the next parameter
  validate: (req, res, next) => {
   
    req
  // Start with a sanitization of the email field, using express-validator’s 
  // normalizeEmail method to convert all email addresses to lowercase and then trim 
  // white space away  
      .sanitizeBody("username")
      .normalizeEmail({
        all_lowercase: true
      })
      .trim(); // Remove whitespace with the trim method.
   // with the validation of email to make sure that it follows the email-format 
   // requirements set by express-validator   
    req.check("username", "Email is invalid").isEmail();
      // The last validation checks that the password field isn’t empty.
    req.check("password", "Password cannot be empty").notEmpty();
   // req.getValidationResult collects the results of the previous validations and returns a
   // promise with those error results.
    req.getValidationResult().then(error => {
   // If errors occur, you can collect their error messages and add them to your 
   // request’s flash messages.   
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
   // If errors have occurred in the validations 
   // This value tells your next middleware function, create, not to process 
   // your user data because of validation errors and instead to skip to your redirectView action.    
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/register";
        next();
      } else {
        next();
      }
    });
  },
  logout:
  (req, res, next)=>{
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
      req.flash("success", "You have been logged out!");
      res.redirect('/')
    })
  })
},

forgotview:(req,res) => {
	res.render("users/forgot")},

resetview:(req,res) => {
    res.render("users/reset")},


/****** reset post action  */  
forgotPost:  (req,res) => {

  console.log("req.body.username:"+req.body.username);
  let user = User.findOne({ username: req.body.username })
  .then(users => {
     // Send saved data to the next then code block.
     // Store the user data on the response and call the next middleware function.
    //res.locals.usersname = usersname;
    res.locals.users = users;
    
    console.log("/********** consogui algo en db ****************/") 
    console.log("users "+ users)
   
    if (users) { 
      req.flash("success", "Email Does Exist");
      res.render("users/reset",{
        /*users: users*/
        users:users})
} else {
        //respond with an invalid email
      
        console.log("error", "Email Does not Exist");
        req.flash("error", "Email Does not Exist");
        /*res.redirect("users/forgot")*/
        res.redirect('back')
    }

 }).catch(error => {
    console.log(`Error fetching users: ${error.message}`);
    req.flash("error", "Error fetching users: ${error.message}");
    res.redirect("back")
  });
}, /**** forgotPost end */

/******resetPost action */
resetpost: (req, res) => {
  

      
  console.log("username: "+User.username);
  console.log("res.locals.username: "+res.locals.username);
  
  
  console.log("req.body.password: "+req.body.password);
  console.log("req.body.confirm: "+req.body.confirm);
  console.log("req.body.username: "+ req.body.username);
  console.log("Estoy en resetpost..");
  let userName = req.body.username,
  
// Collect user parameters from request.  
    userParams = { password: req.body.password };
    console.log("userName:"+userName)
// Use findByIdAndUpdate to locate a user by ID and update the document record in one command.    
  User.findOneAndUpdate(userName, {
// This method takes an ID followed by parameters you’d like to replace for that document
//  by using the $set command    
    $set: userParams
  })
    .then(user => {
      console.log("Actualizado correctamente ....");
      req.flash("success", `${user.username}'Password created successfully!`);
      res.redirect('back');
// Add user to response as a local variable, and call the next middleware function.
      //res.locals.username = username;
      
    })
    .catch(error => {
      console.log(`Error updating user by ID: ${error.message}`);
     
    });
},



/***** fin de users Controllers ********/
}