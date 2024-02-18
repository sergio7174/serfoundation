"use strict";

const 
  // use the Router module in Express.js
  // This line creates a Router object that offers its own middleware
  // and routing alongside the Express.js app object.
  router = require("express").Router(),
  // use system routes
    ///userRoutes = require("./userRoutes"),
    ///subscriberRoutes = require("./subscriberRoutes"),
    ///courseRoutes = require("./courseRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes"),
  opportunitiesindexRoutes = require("./opportunitiesindexRoutes"),
  userRoutes = require ("./userRoutes");

  // implement a namespace for API endpoints that return JSON data or perform actions asynchronously


  // // Adding routes for each page and request type
  ///router.use("/users", userRoutes);
  ///router.use("/subscribers", subscriberRoutes);
  ///router.use("/courses", courseRoutes);
// implement a namespace for API endpoints that return JSON data or perform actions asynchronously
///router.use("/api", apiRoutes);

router.use("/", homeRoutes);

// users routes **IMPORTANTE SI EL LA DIRECION ESTA EN LA RAIZ - MENU PRINCIPAL - EL LLAMADO
// A LAS RUTAS DESDE ESTE ARCHIVO DEBE SER EN LA RAIZ

router.use("/", userRoutes);
router.use("/opportunities",opportunitiesindexRoutes);




router.use("/", errorRoutes);





module.exports = router;
