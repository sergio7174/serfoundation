const middlewareObj = {},
	  Opportunity = require("../models/opportunity"),
	  Post = require("../models/post"),
	  User = require("../models/user");

middlewareObj.isLoggedIn = (req,res,next) =>{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please login first");
	return res.redirect("/login");
}


middlewareObj.isAdmin = (req,res,next) => {
	if(req.isAuthenticated()){
		if(req.user._id.equals("63f54653795f1425c4874e5a")){
			
		 	next();
		 }	
		 console.log("req.session.user._id: "+ req.user._id);
		 console.log("res.locals.adminId: "+ res.locals.adminId);

		if(req.user._id.equals(res.locals.adminId)){

			next();
		}
		else{
			req.flash("error","You don't have permission to do that");
			return res.redirect("/explore");
		}
	}
	else{
		req.flash("error","Please login first");
		return res.redirect("/login");
	}
}

module.exports = middlewareObj;