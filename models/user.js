const 
mongoose = require("mongoose"), 
passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
	username:{
        type: String,
        required: true,
        lowercase: true,
        unique: true},
	name:String,
	password:String,
	
	},{
		// The timestamps property lets Mongoose know to include the createdAt and updatedAt 
		// values, which are useful for keeping records on how and when data changes
		timestamps: true
	  }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);