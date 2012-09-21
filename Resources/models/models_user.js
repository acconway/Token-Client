// User Settings model
var App, model = {}, modelName = "userProperties";

/*
 * Specific 'Object' Methods
 */

exports.getMyName = function(){
	return model.user?model.user.name:""; 
};

exports.getMyID = function(){
	return model.user?model.user.id:"";
};

exports.getLastTransactionTime = function(){
	return model.lastTransactionTime; 
};

exports.getFriendsList = function(){
	return model.friendsList?model.friendsList:[]; 
};

exports.getByName = function(key) {
	return model[key];
};

exports.setByName = function(key, value) {
	model[key] = value;
};

var save = exports.save = function() {
	App.Lib.Data.save(modelName, model)
};

exports.reset = function() {
	model = {};
	App.Lib.Data.save(modelName, model);
	return model;
};

var read = exports.read = function() {
	model = App.Lib.Data.read(modelName) || {};
	return model; 
};

exports.initialize = function(app) {
	App = app;
};

exports.userDataSet = function(){
	return model.user && model.friendsList; 
};
