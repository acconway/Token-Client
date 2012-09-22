var App;

var addTransactionHandleError = function(error, params) {
	//Handle Error
	App.LOG(JSON.stringify(error));
};

var addTransactionHandleSuccess = function(response, params) {
	App.LOG("App.API.Transactions add transaction success! " + JSON.stringify(response));
};

var afterAddTransaction = function(response, params) {
	App.API.handleResponse("addTransaction", response, params, addTransactionHandleError, addTransactionHandleSuccess);
};

exports.addTransaction = function(recipientID, actionName, tokenValue, time) {

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

		App.Models.User.setByName("lastTransactionTime", response.data.lastTransactionTime);
		App.Models.User.save();

		App.Models.Transactions.loadNewTransactions(transactions);

		App.UI.Friends.updateTable();

		App.UI.Notifications.updateTable();
		
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

	var payload = {
		lastTransaction : lastTransaction.toString()
	};

	App.API.send({
		method : "POST",
		path : "/user/" + userID + "/syncTransactions",
		data : payload,
		callback : afterSyncTransactions,
		afterRefresh : afterRefresh
	});
};

exports.initialize = function(app) {
	App = app;
}; 