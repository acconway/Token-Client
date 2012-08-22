var UI = require("/ui/ui_app"), App = this;

var Lib = {
	Facebook : require("lib/lib_facebook")
};

var Data = require("lib/lib_data");

var Models = {
	User : require("models/models_user")
};

require("lib/lib_facebook");

exports.UI = UI;
exports.Lib = Lib;
exports.Models = Models;
exports.Data = Data;

exports.initialize = function() {
	Models.User.initialize(this);
	UI.initialize(this);
	Lib.Facebook.initialize(this);
};

