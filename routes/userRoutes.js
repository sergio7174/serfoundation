"use strict";

const 
  express = require ("express"),
 // use the Router module in Express.js
  router = require("express").Router(),
  app = express(),
  usersController = require("../controllers/usersController"),
  loginIssue = require("../models/loginIssue");

// id for admin

let adminId ="63f54653795f1425c4874e5a";


// Adding routes for each page and request type  
// TO SEE ALL USERS
router.get("/", usersController.index, usersController.indexView);
/// Registration route

// ROUTE TO CREATE USER
router.get("/register", usersController.new);

router.post(
  "/register",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);


// Adding the login route, Add a route to handle
// GET requests made to the /users/login path.

router.get("/index", usersController.index, usersController.indexView);


router.get("/login", usersController.login);
// Add a route to handle POST requests to the same path.
router.post("/login", usersController.authenticate);

router.get("/logout", usersController.logout, usersController.redirectView);

router.get("/forgot", usersController.forgotview);
router.post("/forgot", usersController.forgotPost);

router.get("/reset", usersController.resetview);
router.put("/reset", usersController.resetpost);


// Process data from the edit form, and display the user show page.


module.exports = router;
