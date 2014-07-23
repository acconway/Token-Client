var App = this;
var _ = require('/lib/underscore')._;
var moment = require("/lib/moment");

//Constant for Android platform

var ANDROID = Ti.Platform.name === "android";

var Lib = {
	Facebook : require("lib/lib_facebook"),
	Functions : require("lib/lib_functions"),
	Joli : require("lib/joli"),
	Data : require("lib/lib_data"),
};

var UI = require("/ui/ui_app");
var DB = Lib.Joli.connect('token');
var Models = require('cfg/cfg_models');
var API = require('api/api_app');

var defaultActions = [{
	name : "Letting me pick a movie",
	lastValue : 1
}, {
	name : "Listening to me vent",
	lastValue : 1
}, {
	name : "Waiting for me",
	lastValue : 1
}, {
	name : "Coming over to my place",
	lastValue : 2
}, {
	name : "Setting up a get together",
	lastValue : 2
}, {
	name : "Cooking dinner",
	lastValue : 3
}, {
	name : "A ride to the airport",
	lastValue : 3
}, {
	name : "Letting me stay over",
	lastValue : 4
}, {
	name : "Helping me move",
	lastValue : 5
}];

var CONSTANTS = {
	TOTALPOINTS : 10,
	//Production
	URL : "http://tokenservice.herokuapp.com",
	//Testing
	//URL : "http://localhost:5000",
	defaultActions : defaultActions
};

var logLevel = 1;

/*
* clear out database
*/

//DB.connection.database.close();
//DB.connection.database.remove();
//DB = Lib.Joli.connect('token');

var file = Ti.Filesystem.getFile("lib/arrayDictionary.json");
var data = file.read().text;
var array = JSON.parse(data);

exports.wordList = array;

exports.ANDROID = ANDROID;
exports.CONSTANTS = CONSTANTS;
exports._ = _;
exports.moment = moment;

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
	UI.User.updateTable();
	UI.Notifications.updateTable();
	Lib.Facebook.logout();
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
		Ti.API.info("afterLogin");
		Lib.Facebook.afterLogin();
	} else {
		Lib.Facebook.getPics(0, Models.User.getByName("friendsList"));
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
