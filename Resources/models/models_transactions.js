var App, model;

var schema = {
	table : "transactions",
	columns : {
		id : 'INTEGER PRIMARY KEY',
		senderID : 'TEXT',
		recipientID : 'TEXT',
		tokenValue : 'INTEGER',
		actionName : "TEXT",
		comment : "TEXT",
		time : 'TEXT'
	}
};

var loadNewTransactions = function(transactions) {

	var myID = App.Models.User.getMyID();

	var idsInTransactions = [];

	this.beginTransaction();

	App._.each(transactions, function(transaction, index) {
		var record = model.newRecord(transaction);
		record.save();
		if (transaction.recipientID == myID || transaction.senderID == myID) {
			idsInTransactions.push(transaction.recipientID);
			idsInTransactions.push(transaction.senderID);
		}
	});

	this.endTransaction();

	idsInTransactions = App._.unique(idsInTransactions);

	var friendLookupTable = App.Models.User.getByName("friendsListLookup");

	App._.each(idsInTransactions, function(id) {
		if (id != myID && !App.Models.Friends.hasFriend(id)) {
			App.Models.Friends.addFriend(friendLookupTable[id], id);
		}
	});

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

var getAllTransactionsWithFriend = function(friendID) {
	
	var myID = App.Models.User.getMyID();

	var transactionsToFriend = this.findBy("recipientID", friendID);
	var transactionsFromFriend = this.findBy("senderID", friendID);
	
	var transactions = transactionsToFriend.concat(transactionsFromFriend);
	
	transactions = App._.filter(transactions,function(transaction){
		return (transaction.senderID == myID || transaction.recipientID == myID); 
	});

	return transactions; 
};

var sortTransactionsDescendingByTime = function(transactions) {

	transactions = App._.sortBy(transactions, function(transaction) {
		return parseInt(transaction.time);
	});

	transactions.reverse();

	return transactions;
};

var getAllTransactionsWithFriendAndBalance = function(friendID) {

	var transactions = this.getAllTransactionsWithFriend(friendID);

	transactions = sortTransactionsDescendingByTime(transactions);

	return {
		myBalance : getBalanceFromTransactions(transactions),
		transactions : transactions
	};

};

var getAllActions = function(friendID) {

	var myID = App.Models.User.getMyID();

	var actions = {};

	var transactions = this.getAllTransactionsWithFriend(friendID);

	transactions = sortTransactionsDescendingByTime(transactions);

	App._.each(transactions, function(transaction) {
		if (transaction.senderID == myID) {
			var isDefault = App._.find(App.CONSTANTS.defaultActions,function(action){
				return action.name == transaction.actionName;
			});
			if (!actions[transaction.actionName] && !isDefault) {
				actions[transaction.actionName] = {
					name : transaction.actionName,
					lastValue : transaction.tokenValue
				};
			}
		}
	});

	return App._.values(actions);

};

var addTransaction = function(recipientID, actionName, tokenValue, time) {

	if (recipientID && tokenValue && actionName) {

		var record = model.newRecord({
			senderID : App.Models.User.getMyID(),
			recipientID : recipientID,
			tokenValue : tokenValue,
			actionName : actionName,
			time : time
		});

		record.save();

		App.UI.Notifications.addRow(record);
		App.UI.User.addRow(record);
	}

};

exports.initialize = function(app) {
	App = app;

	model = new App.DB.model({
		table : schema.table,
		columns : schema.columns,
		methods : {
			addTransaction : addTransaction,
			getAllTransactionsWithFriend : getAllTransactionsWithFriend,
			getAllTransactionsWithFriendAndBalance : getAllTransactionsWithFriendAndBalance,
			getAllActions : getAllActions,
			loadNewTransactions : loadNewTransactions,
			sortTransactionsDescendingByTime : sortTransactionsDescendingByTime
		},
		objectMethods : {}
	});

	return model;
};
