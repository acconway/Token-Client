var App, model;

var schema = {
	table : "transactions",
	columns : {
		id : 'INTEGER PRIMARY KEY',
		senderID : 'INTEGER',
		recipientID : 'INTEGER',
		tokenValue : 'INTEGER',
		actionName : "TEXT",
		comment : "TEXT",
		time : 'TEXT'
	}
};

var getBalanceFromTransactions = function(transactions) {

	var myBalance = 5;

	var myID = App.Models.User.getMyID();

	App._.each(transactions, function(transaction) {
		if (transaction.senderID == myID) {
			myBalance -= transaction.tokenValue;
		} else {
			myBalance += transaction.tokenValue;
		}
	});

	return myBalance;

};

var getAllTransactionsWithFriendAndBalance = function(friendID) {

	var transactionsToFriend = this.findBy("recipientID", friendID);
	var transactionsFromFriend = this.findBy("senderID", friendID);

	var transactions = transactionsToFriend.concat(transactionsFromFriend);

	transactions = App._.sortBy(transactions, function(transaction) {
		return parseInt(transaction.time);
	});

	transactions.reverse();

	return {
		myBalance : getBalanceFromTransactions(transactions),
		transactions : transactions
	};

};

var getAllActions = function() {

	var myID = App.Models.User.getMyID();

	var actions = {};

	var transactions = this.all();

	transactions = App._.sortBy(transactions, function(transaction) {
		return parseInt(transaction.time);
	});

	transactions.reverse();

	App._.each(transactions, function(transaction) {
		if (transaction.senderID == myID) {
			if (!actions[transaction.actionName]) {
				actions[transaction.actionName] = {
					name : transaction.actionName,
					lastValue : transaction.tokenValue
				};
			}
		}
	});
	
	return App._.values(actions); 

};

var addTransaction = function(recipientID, actionName, tokenValue) {

	if (recipientID && tokenValue && actionName) {

		var now = new Date();

		Ti.API.info(now.getTime());

		var record = model.newRecord({
			senderID : App.Models.User.getMyID(),
			recipientID : recipientID,
			tokenValue : tokenValue,
			actionName : actionName,
			time : now.getTime().toString()
		});

		record.save();
	}

};

exports.initialize = function(app) {
	App = app;

	model = new App.DB.model({
		table : schema.table,
		columns : schema.columns,
		methods : {
			addTransaction : addTransaction,
			getAllTransactionsWithFriendAndBalance : getAllTransactionsWithFriendAndBalance,
			getAllActions : getAllActions
		},
		objectMethods : {}
	});

	return model;
};
