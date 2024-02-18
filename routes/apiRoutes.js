"use strict";

const 
// Require the Express.js router
// use the Router module in Express.js
router = require("express").Router(),
//Require courses controller.
coursesController = require("../controllers/coursesController");

router.get("/courses/:id/join", coursesController.join, coursesController.respondJSON);
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  // Add the API route to the Express.js Router.
  coursesController.respondJSON
);
// Add API error-handling middleware.
router.use(coursesController.errorJSON);

module.exports = router;
