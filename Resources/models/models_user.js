// Settings model

// Example
var App, model = {}, modelName = "scwtdata";

var defaults = {
	friends : {
		1063230066 : {
			name : "Charles Strauss",
			id : 1063230066,
			level : 1,
			myBalance : 5,
			transactionHistory : [],
			savedActions : [{
				name : "Bought me a drink",
				value : 1
			}, {
				name : "Gave me a ride",
				value : 2
			}, {
				name : "Bought me dinner",
				value : 3
			}]
		}
	}
};

var setDefaults = function() {
	model.friends = defaults.friends;
};

exports.getByName = function(key) {
	return model[key];
};

exports.setByName = function(key, value) {
	model[key] = value;
};

var save = exports.save = function() {
	App.Data.save(modelName, model)
}

exports.reset = function() {
	model = {};
	setDefaults();
	App.Data.save(modelName, model);
	return model;
}
var read = exports.read = function() {
	model = App.Data.read(modelName) || {};
	return model; 
}

exports.initialize = function(app) {
	App = app;
};

exports.defaults = defaults;

