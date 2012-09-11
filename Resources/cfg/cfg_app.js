var App = this; 
var _ = require('/lib/lib_underscore')._;

//Constant for Android platform 

var ANDROID = Ti.Platform.name == "android";

var UI = require("/ui/ui_app");
var Data = require("lib/lib_data");

var Lib = {
	Facebook : require("lib/lib_facebook"),
	Functions: require("lib/lib_functions")
};

var Models = {
	User : require("models/models_user")
};

var CONSTANTS = {
	TOTALPOINTS:10
};

require("lib/lib_facebook");

exports.ANDROID = ANDROID; 
exports.CONSTANTS = CONSTANTS; 
exports._ = _; 
exports.UI = UI;
exports.Lib = Lib;
exports.Models = Models;
exports.Data = Data;

exports.initialize = function() {
	UI.initialize(this);
	Lib.Facebook.initialize(this);
};

