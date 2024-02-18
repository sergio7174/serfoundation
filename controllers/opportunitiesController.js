"use strict";

const 
express = require("express"), 
router = express.Router(), 
Opportunity = require("../models/opportunity");

// id del Admin del sistema
let User_ID = "63f54653795f1425c4874e5a";



var getIdfromUri = (uri) => {
	var s=uri.search("&id=");
	console.log("uri search s: "+s)
	console.log("uri.slice(s+4): "+ uri.slice(s+4));
	//return uri.slice(s+4);
	return uri;
}

var getUri = (data) => {
	 return data.heading.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')+"&id="+data._id
}

module.exports = {
  show: (req,res) => {
	Opportunity.find({ "isApproved": true, "category": 1 }, (err, Opportunities) =>{
		if (err) {
			console.log(err);
		} else {
			res.render("opportunities/categoriesindex/science",{ opportunities: Opportunities });
		} return;
	});},

// action to show oportunities view page
index:(req,res) => {
    res.render("opportunities/index");
	return;
  },

// action add a new oportunity
new:  (req,res) =>{ 
	res.render("opportunities/new");
	res.end();
	return;
},

showScience: (req,res) => {
	Opportunity.find({ "isApproved": true, "category": 1 }, (err, Opportunities) =>{
		if (err) {
			console.log(err);
		} else {
			res.render("opportunities/Categoriesindex/science",{ opportunities: Opportunities });
			res.end();
		}
return;	});
},
// Show route /Home/Opportunities/Science/opportunities
// boton read more del view general.ejs - <a href="/opportunities/<%= slug %>"

uri: (req,res) => {
	let id=getIdfromUri(req.params.uri);
	
	console.log("req.params.uri: "+ req.params.uri);


	Opportunity.findById(id, (err,foundOpportunity) => {
		if(err){
			console.log(err);
			req.flash("error","Could not display the opportunity");
			res.redirect("/opportunities");
			res.end();
		}
		else{

			console.log("foundOpportunity"+ foundOpportunity)
			res.render("opportunities/show",{
				// parametros to view page opportunities/show
				opportunity:foundOpportunity,
				// parametro admin Id coming from the begining of this page up
				adminId: User_ID,
			});
			res.end();
		}
		return; 
	});
},

// path Home/Opportunities/Heading button Edit
// Edit route
// show edit book page
opportunityEdit: (req,res)=>{
	
	console.log("Entrando a opportunityEdit")
    Opportunity.findById(req.params.id,(err,foundopportunity)=>{

    res.render("opportunities/edit",{opportunity:foundopportunity});
	res.end();
    });
 },



opportunityPut: (req,res) => {	
	Opportunity.findByIdAndUpdate(req.params.id,req.body.opportunity, (err,updatedOpportunity) => {
		if(err){
			console.log(err);
		}
		else{
			req.flash("success","Opportunity updated successfully");
			res.redirect("/opportunities/"+getUri(updatedOpportunity));
			res.end();
		}
	});
},

showbusiness: (req,res) => {
	console.log("Entrando en showbusiness....")
	Opportunity.find({"isApproved":true,"category":2}, (err, Opportunities) => {
		if (err){
			console.log(err);
		} else{
			 console.log("Opportunities:"+ Opportunities)
			 res.render("opportunities/Categoriesindex/business",{ opportunities: Opportunities });
			 res.end();
		}
	});
},

showlegal: (req,res) => {
	Opportunity.find({"isApproved":true,"category":3}, (err, Opportunities) => {
		if(err){
			console.log(err);
		}
		else{
			 console.log("Opportunities legal: "+Opportunities)
			 res.render("opportunities/Categoriesindex/legal",{ opportunities: Opportunities });
			 res.end();
		}
	});
},


}