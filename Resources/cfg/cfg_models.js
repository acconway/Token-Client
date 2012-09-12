var App;

var Friends, Transactions;

var FriendsModule = require("/models/models_friends");
var TransactionsModule = require("/models/models_transactions");

var User = require("/models/models_user");
exports.User = User;

var models;

var purge = function() {
	var records = this.all();
	var ids = App._.map(records, function(record) {
		return record.id;
	});
	this.deleteRecords(ids);
};

var createRecord = function(thisModel, recordData) {
	var newRecord = thisModel.newRecord(recordData);
	newRecord.save();
};

var load = function(records, options) {

	var thisModel = this;
	records = App._.compact(records);

	if (options && options.purgeFirst) {
		thisModel.purge();
	}

	thisModel.beginTransaction();

	App._.each(records, function(recordData, index) {
		createRecord(thisModel, recordData);
	});

	thisModel.endTransaction();

};

var addModelFunctions = function() {
	App._.each(models, function(model) {
		model.purge = purge;
		model.load = load;
	});
};

exports.purgeAll = function() {
	Friends.purge();
	Transactions.purge();

	User.reset();
};

exports.initialize = function(app) {
	App = app;
	self = this;

	Friends = FriendsModule.initialize(app);
	Transactions = TransactionsModule.initialize(app);
	User.initialize(app);

	exports.Friends = Friends;
	exports.Transactions = Transactions;

	models = [Friends, Transactions];

	App.DB.models.initialize();
	addModelFunctions();
};
