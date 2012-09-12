var App;

var currentData;

var _ = require('/lib/lib_underscore')._;

Ti.include("/lib/lib_date.js");

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Friendship"
	},
	views : {
		main : {
			width : "100%",
			height : "100%",
			layout : "vertical",
			backgroundColor : "transparent",
			contentHeight : "auto",
			showVerticalScrollIndicator : true
		},
		user : {
			width : Ti.UI.SIZE,
			height : 60,
			top : 10,
			borderRadius : 10,
			backgroundColor : "white",
			layout : "horizontal",
			borderColor : "black"
		},
		padding : {
			width : 10,
			height : 60,
			left : 0
		},
		userName : {
			top : 5,
			width : Ti.UI.SIZE,
			height : 50,
			layout : 'vertical'
		},
		balance : {
			top : 0,
			width : Ti.UI.SIZE,
			height : 60,
			backgroundColor : "white"
		},
		balanceBar : {
			top : 15,
			height : 30,
			left : 90,
			borderColor : "black",
			borderWidth : 1,
			width : 120,
			backgroundColor : "white",
			layout : "horizontal"
		},
		balanceBarColor : {
			height : 30,
			width : 0,
			backgroundColor : "red",
			left : 0
		},
		balanceBarDivider : {
			height : 30,
			width : 1,
			backgroundColor : "black",
			left : 0
		},
		historyTable : {
			top : 10,
			height : 0,
			width : "90%",
			scrollable : false,
			borderRadius : 10,
			borderColor : "black",
			backgroundColor : "white"
		},
		historyRow : {
			width : "100%",
			height : 50,
			backgroundColor : "white",
			touchEnabled:false
		}
	},
	labels : {
		balanceTitle : {
			top : 10,
			width : Ti.UI.SIZE,
			textAlign : "center",
			height : Ti.UI.SIZE,
			font : {
				fontSize : 20,
				fontWeight : "bold"
			},
			color : "black",
			text : "Balance"
		},
		balance : {
			top : 0,
			left : 0,
			height : 30,
			width : Ti.UI.SIZE
		},
		historyTitle : {
			top : 10,
			width : Ti.UI.SIZE,
			textAlign : "center",
			height : Ti.UI.SIZE,
			font : {
				fontSize : 20,
				fontWeight : "bold"
			},
			color : "black",
			text : "History"
		},
		historyDate : {
			width : 80,
			height : 50,
			left : 10,
			font : {
				fontSize : 14
			}
		},
		historyName : {
			width : "auto",
			height : 50,
			left : 100,
			font : {
				fontSize : 14
			}
		},
		historyValue : {
			width : "auto",
			height : 50,
			right : 15,
			font : {
				fontSize : 14
			}
		}
	},
	buttons : {},
	images : {
		profilePic : {
			width : 50,
			height : 50,
			borderRadius : 10,
			top : 5,
			left : 10
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main),
		padding : Ti.UI.createView(cfg.views.padding),
		balance : Ti.UI.createView(cfg.views.balance),
		balanceBar : Ti.UI.createView(cfg.views.balanceBar),
		balanceBarColor : Ti.UI.createView(cfg.views.balanceBarColor),
		balanceBarDivider : Ti.UI.createView(cfg.views.balanceBarDivider),
		historyTable : Ti.UI.createTableView(cfg.views.historyTable)
	},
	labels : {
		balanceTitle : Ti.UI.createLabel(cfg.labels.balanceTitle),
		myBalance : Ti.UI.createLabel(cfg.labels.balance),
		friendBalance : Ti.UI.createLabel(cfg.labels.balance),
		historyTitle : Ti.UI.createLabel(cfg.labels.historyTitle),
	},
	buttons : {},
	images : {}
};

var addHistoryRow = function(name, value, date, note) {

	var row = Ti.UI.createTableViewRow(cfg.views.historyRow);

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var nameLabel = Ti.UI.createLabel(cfg.labels.historyName);
	var valueLabel = Ti.UI.createLabel(cfg.labels.historyValue);

	dateLabel.text = date.customFormat("#MM#/#DD#/#YYYY#");
	nameLabel.text = name;
	valueLabel.text = value;

	row.add(dateLabel);
	row.add(nameLabel);
	row.add(valueLabel);

	ti.views.historyTable.height += row.height;

	return row;

};

var buildBalanceView = function() {

	ti.views.balanceBar.add(ti.views.balanceBarColor);
	ti.views.balanceBar.add(ti.views.balanceBarDivider);

	ti.labels.friendBalance.top = 30;

	ti.views.balance.add(ti.labels.myBalance);
	ti.views.balance.add(ti.labels.friendBalance);
	ti.views.balance.add(ti.views.balanceBar);

};

var refreshTable = function() {

	var tableData = [];

	ti.views.historyTable.height = 0;

	_.each(currentData.transactions, function(transaction) {
		tableData.push(addHistoryRow(transaction.actionName, transaction.tokenValue, new Date(parseInt(transaction.time)), transaction.comment));
	});

	ti.views.historyTable.setData(tableData);

};

var refreshBalance = function() {

	var myBalance = currentData.myBalance;

	var friendBalance = App.CONSTANTS.TOTALPOINTS - myBalance;

	ti.labels.myBalance.text = "Me: " + myBalance;
	ti.labels.friendBalance.text = "Them: " + friendBalance;

	ti.views.balanceBarColor.width = myBalance * (ti.views.balanceBar.width / App.CONSTANTS.TOTALPOINTS);

};

var update = function(friend) {

	currentData = App.Models.Transactions.getAllTransactionsWithFriendAndBalance(friend.userID);

	ti.win.title = friend.name;

	refreshBalance();

	refreshTable();

};

exports.open = function(friend) {
	update(friend);
	ti.tab.open(ti.win);
};

var buildHierarchy = function() {
	ti.win.backButtonTitle = "Back";
	buildBalanceView();
	ti.views.main.add(ti.labels.balanceTitle);
	ti.views.main.add(ti.views.balance);
	ti.views.main.add(ti.labels.historyTitle);
	ti.views.main.add(ti.views.historyTable);
	ti.win.add(ti.views.main);
};

var addEventListeners = function() {
};

exports.initialize = function(app, tab) {
	App = app;
	ti.tab = tab;
	buildHierarchy();
	addEventListeners();
};
