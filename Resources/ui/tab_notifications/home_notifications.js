var App;

var transactions; 

Ti.include("/lib/lib_date.js");

var cfg = {
	tab : "",
	win : {
		backgroundColor : "white",
		title : "Token"
	},
	table : {
		top : 0,
		minRowHeight : 50,
		separatorColor:"black"
	},
	views : {
		row : {
			height : 80
		},
		topRow : {
			top : 0,
			left: 10,
			width : Ti.UI.SIZE,
			height : 40,
			layout : "horizontal"
		},
		bottomRow : {
			top : 40,
			left: 10,
			width : Ti.UI.SIZE,
			height : 40,
			layout : "horizontal"
		}
	},
	labels : {
		date : {
			width : Ti.UI.SIZE,
			height : 40,
			left : 0,
			font : {
				fontSize : 16
			}
		},
		tokens : {
			left:30,
			width : Ti.UI.SIZE,
			height : 40,
			font : {
				fontSize : 16
			}
		},
		direction : {
			width : Ti.UI.SIZE,
			height : 40,
			left : 0,
			font : {
				fontSize : 16,
				fontWeight : "bold"
			}
		},
		name : {
			left : 5,
			width : Ti.UI.SIZE,
			height : 40,
			font : {
				fontSize : 16
			}
		},
		forLabel : {
			left : 10,
			width : Ti.UI.SIZE,
			height : 40,
			text : "For:",
			font : {
				fontSize : 16,
				fontWeight : "bold"
			}
		},
		action : {
			left : 5,
			width : Ti.UI.SIZE,
			height : 40,
			font : {
				fontSize : 16
			}
		}
	},
	buttons : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {},
	labels : {},
	buttons : {}
};

var buildNotificationRow = function(transaction, friendLookupTable) {

	var sent = (transaction.senderID == App.Models.User.getMyID());

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	var topRow = Ti.UI.createView(cfg.views.topRow);
	var bottomRow = Ti.UI.createView(cfg.views.bottomRow);

	var dateLabel = Ti.UI.createLabel(cfg.labels.date);
	var tokensLabel = Ti.UI.createLabel(cfg.labels.tokens);
	var directionLabel = Ti.UI.createLabel(cfg.labels.direction);
	var nameLabel = Ti.UI.createLabel(cfg.labels.name);
	var forLabel = Ti.UI.createLabel(cfg.labels.forLabel);
	var actionLabel = Ti.UI.createLabel(cfg.labels.action);

	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#/#YYYY#");
	tokensLabel.text = ( sent ? "Sent" : "Recieved") + " " + transaction.tokenValue + " Token"+(transaction.tokenValue>1?"s":"");
	directionLabel.text = sent ? "To:" : "From:";
	nameLabel.text = sent ? friendLookupTable[transaction.recipientID] : friendLookupTable[transaction.senderID];
	actionLabel.text = transaction.actionName;

	topRow.add(dateLabel);
	topRow.add(tokensLabel);
	
	bottomRow.add(directionLabel);
	bottomRow.add(nameLabel);
	bottomRow.add(forLabel);
	bottomRow.add(actionLabel);
	
	row.add(topRow);
	row.add(bottomRow);

	return row;
};

var buildNotificationsTable = function() {

	var friendLookupTable = App.Models.User.getByName("friendsListLookup");

	ti.table.setData([]);

	App._.each(transactions, function(transaction) {
		ti.table.appendRow(buildNotificationRow(transaction, friendLookupTable));
	});

};

var refresh = function() {
	App.API.Transactions.syncTransactions(App.Models.User.getLastTransactionTime(),ti.table.afterRefresh);
};

var buildHierarchy = function() {

	ti.tab = Ti.UI.createTab({
		window : ti.win,
		title : "Notifications"
	});

	if (!App.ANDROID) {

		App.UI.addScrollToRefreshViewToTable(ti.table, refresh);

	}

	ti.win.add(ti.table);

	ti.win.rightNavButton = App.UI.createSendTokensButton();

};

var addEventListeners = function() {

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

var updateTable = exports.updateTable = function() {

	transactions = App.Models.Transactions.all();

	transactions = App.Models.Transactions.sortTransactionsDescendingByTime(transactions);

	buildNotificationsTable();

};

exports.addRow = function(transaction){
	
	var friendLookupTable = App.Models.User.getByName("friendsListLookup");
	
	ti.table.insertRowBefore(0,buildNotificationRow(transaction, friendLookupTable));
	
};

exports.getTab = function() {
	return ti.tab;
};
