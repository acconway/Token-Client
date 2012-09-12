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
var DB = Lib.Joli.connect('utilisphere');
var Models = require('cfg/cfg_models');

var CONSTANTS = {
	TOTALPOINTS : 10
};

exports.ANDROID = ANDROID;
exports.CONSTANTS = CONSTANTS;
exports._ = _;

exports.Lib = Lib;
exports.UI = UI;
exports.DB = DB;
exports.Models = Models;

exports.initialize = function() {
	Lib.Facebook.initialize(this);
	Models.initialize(this);
	UI.initialize(this);
};

exports.logout = function() {
	Models.purgeAll();
	Ti.Facebook.logout();
	UI.closeTabGroup();
	UI.Login.getWin().open();
};
