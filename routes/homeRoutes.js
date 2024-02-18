"use strict";


const
// use the Router module in Express.js 
router = require("express").Router(),

homeController = require("../controllers/homeController"),
usersController = require("../controllers/usersController");
// Adding routes for each page and request type
router.get("/", homeController.index);



// users routes
router.get("/about", homeController.about);

//router.get("/register", usersController.new);






module.exports = router;
