"use strict";

let User_ID = "63f54653795f1425c4874e5a";

// Export object literal with all controller actions.
module.exports = {

// id del Admin del sistema

    
// Root route
index:("/", (req,res) => {
    res.render("home",{
      // parametros to view page opportunities/show
    
      adminId: User_ID,
    })
  }),

  // Root route
about:("/", (req,res) => {
    res.render("about")
  }),

}