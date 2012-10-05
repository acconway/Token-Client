var App;

var addTransactionHandleError = function(error, params) {
	//Handle Error
	App.LOG(JSON.stringify(error));
	App.UI.hideWait();
	alert("Failed to send tokens! Please try again!");
};

var addTransactionHandleSuccess = function(response, params) {
	App.LOG("App.API.Transactions add transaction success! " + JSON.stringify(response));
	App.Models.Transactions.addTransaction(params.data.recipientID, params.data.actionName, params.data.tokenValue, params.data.time);
	App.Models.User.setByName("lastTransactionTime", (params.data.time).toString());
	App.UI.Friends.Detail.update();
	App.Models.User.save();
	App.UI.hideWait();
	alert("Sent " + params.data.tokenValue + " Token" + (params.data.tokenValue > 1 ? "s" : "") + " To " + params.name);
};

var afterAddTransaction = function(response, params) {
	App.API.handleResponse("addTransaction", response, params, addTransactionHandleError, addTransactionHandleSuccess);
};

exports.addTransaction = function(recipientID, actionName, tokenValue, time, name) {

	var userID = App.Models.User.getMyID();

	var payload = {
		recipientID : recipientID,
		tokenValue : tokenValue,
		actionName : actionName,
		time : time
	};

	App.API.send({
		method : "POST",
		path : "/user/" + userID + "/addTransaction",
		data : payload,
		name : name,
		callback : afterAddTransaction
	});
};

var syncTransactionsHandleError = function(error, params) {
	//Handle Error
	App.LOG(JSON.stringify(error));
	App.UI.hideWait();
};

var syncTransactionsHandleSuccess = function(response, params) {

	App.LOG("App.API.Transactions syncTransactions success! " + JSON.stringify(response));

	var transactions = response.data.newTransactions;

	if (transactions.length > 0) {

		transactions = App.Models.Transactions.sortTransactionsDescendingByTime(transactions);

		App.Models.User.setByName("lastTransactionTime", transactions[0].time);

		App.Models.User.save();

		App.Models.User.save();

		App.Models.Transactions.loadNewTransactions(transactions);

		App.UI.Friends.updateTable();

		App.UI.Notifications.updateTable();

		App.UI.User.updateTable();

		App.UI.Friends.Detail.update();

	}

	if (params.afterRefresh) {
		params.afterRefresh();
	}

	App.UI.hideWait();

};

var afterSyncTransactions = function(response, params) {
	App.API.handleResponse("syncTransactions", response, params, syncTransactionsHandleError, syncTransactionsHandleSuccess);
};

exports.syncTransactions = function(lastTransaction, afterRefresh) {

	var userID = App.Models.User.getMyID();	

	if (lastTransaction >= 0) {

		var payload = {
			lastTransaction : lastTransaction.toString()
		};

		App.API.send({
			method : "POST",
			//path : "/user/" + userID + "/syncTransactions",
			path : "/syncAllTransactions",
			data : payload,
			callback : afterSyncTransactions,
			afterRefresh : afterRefresh
		});

	}else{
		afterRefresh();
		App.UI.hideWait(); 
	}
};

exports.initialize = function(app) {
	App = app;
};
