"use strict";

const 
express = require("express"), 
router = express.Router(), 
Opportunity = require("../models/opportunity"),
opportunitiesController = require("../controllers/opportunitiesController"),
middleware = require("../middleware/index"),
multer = require("multer");

// Multer setup - Multer es un middleware para Express y Node.js que hace que sea fácil 
// manipular este multipart/form-data cuando tus usuarios suben archivos a traves 
// de un formulario - imagenes and videos
/*multer = require('multer');*/
let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

//const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});

var getIdfromUri = (uri) => {
	var s=uri.search("&id=");
	return uri.slice(s+4);
}

var getUri = (data) => {
	 return data.heading.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')+"&id="+data._id
}

let imageFilter = (req, file, cb) => {
    // Accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};



// Cloudinary is a cloud service built using AWS S3 that makes image and video 
// storage and management easy and convenient.

// Cloudinary setup
let cloudinary = require('cloudinary');

// Config
cloudinary.config({
  cloud_name: "dcv9fbml3",
  api_key: "376662851175851",
  api_secret: "9zR7ufXs5VYusEMcxYmE4fGzgJA"
});

// Generate 
const url = cloudinary.url("olympic_flag", {
  width: 100,
  height: 150,
  Crop: 'fill'
});


// var upload to use it with multer
let upload = multer({ storage: storage, fileFilter: imageFilter});


// opportunities index route
router.get("/", opportunitiesController.index);


// Add new opportunity block beginning

// Add a New opportunity route
router.get("/new", middleware.isLoggedIn,opportunitiesController.new);

// Add a New opportunity route post
// router.post("/new", middleware.isLoggedIn, opportunitiesController.newpost);

// Create route
router.post("/new", middleware.isLoggedIn,upload.single('image'), (req,res) => {
    console.log("entrando a opportunities new ....")
	cloudinary.uploader.upload(req.file.path, (result)=> {
  		req.body.image = result.secure_url;
	  	req.body.imageId = result.public_id;
      
        let opportunityParams = {
            heading: req.body.heading,
            shortDescription: req.body.shortDescription,
            organisation: req.body.organisation,
            detail: req.body.detail,
            image: result.secure_url,
            imageId: result.public_id,
            category: req.body.category,
            eligibility: req.body.eligibility,
            dates:req.body.dates,
            process:req.body.process,
            prize:req.body.prize,
            contact:req.body.contact,
            other:req.body.other,
            author:{
              id: req.user._id,
              username: req.user.username,
              name: req.user.name
          }
          };
         // save opportunityParams in database
          Opportunity.create(opportunityParams).then(newOpportunity => {
           // 
           console.log("Creo que creo guardo....");
           // res.render = ("opportunities/index");
           // redireccionar back
           //res.locals.redirect = "back";
           res.redirect("opportunities/index");
            
            
          }).catch(error => {
            console.log(`Error saving subscriber: ${error.message}`);
            next(error);
          });
         
})
/*console.log("res.locals.redirect = 'opportunities/index'")
res.locals.redirect = "opportunities/index";*/
});



// Index routes
router.get("/science", opportunitiesController.showScience);

// Show route /Home/Opportunities/Science/opportunities
// boton read more del view general.ejs - <a href="/opportunities/<%= slug %>"
router.get("/:uri",middleware.isLoggedIn,opportunitiesController.uri);

// path Home/Opportunities/Heading button Edit
// Edit route
router.get("/:id/edit",middleware.isAdmin,opportunitiesController.opportunityEdit);

// path Home/Opportunities/Heading button Edit
// Edit route
// Update action
router.put("/:id", middleware.isAdmin,opportunitiesController.opportunityPut);


// path to business option in opportunities page
router.get("/business", opportunitiesController.showbusiness);

// path to legal option
// Index route
router.get("/legal",opportunitiesController.showlegal);




module.exports = router;
