const 
express = require("express"), 
router = express.Router(), 
Opportunity = require("../models/opportunity"), 
middleware = require("../middleware"),
OpportunityindexRoutes = require("./opportunitiesindex");


// Multer setup 
const multer = require('multer');
let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
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

let upload = multer({ storage: storage, fileFilter: imageFilter});

// Cloudinary setup
let cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Index Route
router.get("/", (req,res) =>
	res.render("opportunities/index")
);

// New route
router.get("/new", middleware.isLoggedIn, (req,res) => 
	res.render("opportunities/new")
);

// Create route
router.post("/", middleware.isLoggedIn,upload.single('image'), (req,res) => {
	cloudinary.uploader.upload(req.file.path, (result)=> {
  		req.body.opportunity.image = result.secure_url;
		req.body.opportunity.imageId = result.public_id;

        /*****begin modificacion mia *******/

		let opportunityParams = {
			name:req.body.name,
			price:req.body.price,
			phone:req.body.phone,
			image:req.body.image,
			disc:req.body.discription,
			// get data of user to save it to book inf
			author:{
			id: req.user._id,
			username: req.user.username}}
        


		 /*****end  modificacion mia *******/

		Opportunity.create(req.body.opportunity, (err,newOpportunity) => {
			if(err){
				console.log(err);
			}
			else{
				res.redirect("/opportunities");
			}
		});
	});
});

router.use(OpportunityindexRoutes);