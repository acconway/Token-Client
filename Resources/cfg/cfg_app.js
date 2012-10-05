var App = this;
var _ = require('/lib/lib_underscore')._;

//Constant for Android platform

var ANDROID = Ti.Platform.name === "android";

var Lib = {
	Facebook : require("lib/lib_facebook"),
	Functions : require("lib/lib_functions"),
	Joli : require("lib/joli"),
	Data : require("lib/lib_data")
};

var UI = require("/ui/ui_app");
var DB = Lib.Joli.connect('token');
var Models = require('cfg/cfg_models');
var API = require('api/api_app');


var CONSTANTS = {
	TOTALPOINTS : 10,
	//Production
	URL:"http://tokenservice.herokuapp.com"
	//Testing
	//URL:"http://localhost:5000"
};

var logLevel = 1; 

/*
* clear out database
*/

//DB.connection.database.close();
//DB.connection.database.remove();
//DB = Lib.Joli.connect('token');

exports.ANDROID = ANDROID;
exports.CONSTANTS = CONSTANTS;
exports._ = _;

exports.Lib = Lib;
exports.UI = UI;
exports.DB = DB;
exports.Models = Models;
exports.API = API; 

exports.initialize = function() {
	Lib.Facebook.initialize(this);
	Models.initialize(this);
	UI.initialize(this);
	API.initialize(this);
};

exports.logout = function() {
	Models.purgeAll();
	var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "profilepics");
	dir.deleteDirectory(true);
	UI.Friends.refresh();
	Ti.Facebook.logout();
	UI.closeTabGroup();
	UI.Login.getWin().open();
};

exports.login = function() {
	//create profile pic directory
	var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "profilepics");
	if (!dir.exists()) {
		dir.createDirectory();
	}
	UI.Login.getWin().close(); 
	UI.openTabGroup(); 
	UI.showWait("Logging In...");
	Models.User.read();
	if (!Models.User.userDataSet()) {
		Lib.Facebook.afterLogin();
	}else{
		UI.Notifications.updateTable();
		UI.User.updateTable(); 
		UI.hideWait(); 
	}
};

var LOG = exports.LOG = function(str, level) {
    if (level === undefined) {
        level = 1;
    }

    if (level <= logLevel) {
        Ti.API.info(str);
    }
};
