var App;
var transactions = [];
var rowData = [];
var friendLookupTable;

var Detail = require("ui/tab_friends/detail");

exports.Detail = Detail;

var cfg = {
	win : {
		backgroundColor : "white",
		title : 'exchanges',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	},
	views : {
		main : {
			height : "100%",
			width : "100%",
			contentHeight : Ti.UI.SIZE,
			showVerticalScrollIndicator : true,
			backgroundColor : "transparent",
			layout : "vertical"
		},
		row : {
			hasChild : true,
			height : 50,
			selectedBackgroundColor : "white"
		},
		historyRow : {
			width : "100%",
			height : 50,
			touchEnabled : false
		},
		historyLabelView : {
			width : 140,
			height : 60,
			right : 0
		}
	},
	table : {
		top : 0,
		minRowHeight : 50,
		width : "100%",
		height : "100%",
		filterAttribute : 'name'
	},
	search : {
		barColor : "white",
		showCancel : false,
		hintText : 'search'
	},
	labels : {
		friend : {
			font : {
				fontSize : 18
			},
			left : 70,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black",
			touchEnabled : false
		},
		historyDate : {
			height : Ti.UI.SIZE,
			color : "black",
			font : {
				fontSize : 15
			},
			right : 5,
			width : Ti.UI.SIZE
		},
		historyAction : {
			left : 10,
			width : "90%",
			height : Ti.UI.SIZE,
			color : "black",
			font : {
				fontSize : 14
			}
		}
	},
	images : {
		friend : {
			left : 5,
			width : 40,
			height : 40,
			borderRadius : 4
		}
	},
	buttons : {
		logout : {
			title : "logout",
			height : 30,
			width : 200
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main),
		noFriends : Ti.UI.createView(cfg.views.row)
	},
	labels : {},
	table : Ti.UI.createTableView(cfg.table),
	buttons : {
		logout : Ti.UI.createButton(cfg.buttons.logout)
	}
};

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {

		var rowFriend = App.ANDROID ? e.source.friend : e.rowData.friend;

		if (rowFriend) {
			Detail.open(rowFriend);
		}

	});

	ti.buttons.logout.addEventListener("click", function() {
		App.logout();
	});

};

var buildRow = function(friend) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.friend = friend;

	row.label = Ti.UI.createLabel(cfg.labels.friend);
	row.label.text = friend.name.toLowerCase();

	row.name = friend.name.toLowerCase();

	row.add(row.label);

	var image = Ti.UI.createImageView(cfg.images.friend);

	row.image = image;

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friend.userID + ".png");

	if (file.exists()) {
		image.image = file;
	} else {
		image.image = "/images/defaultprofile.png";
	}

	row.add(image);

	return row;
};

var buildHistoryRow = function(transaction) {

	var sent = (transaction.senderID == App.Models.User.getMyID());

	var delimiterIndex = transaction.actionName.indexOf(":");

	var transactionWord = delimiterIndex >= 0 ? transaction.actionName.substring(0, delimiterIndex) : transaction.actionName;
	var transactionDefinition = delimiterIndex >= 0 ? transaction.actionName.substring(delimiterIndex + 1, transaction.actionName.length) : "No definition sorry (it's a bug)')";

	var row = Ti.UI.createTableViewRow(cfg.views.historyRow);

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var actionLabel = Ti.UI.createLabel(cfg.labels.historyAction);

	dateLabel.text = App.moment(parseInt(transaction.time)).format("h:mm a");

	if (sent) {
		actionLabel.text = App.Lib.Functions.getFirstName(App.Models.User.getMyName()).toLowerCase() + ": " + transactionWord.toLowerCase() + " to " + App.Lib.Functions.getFirstName(friendLookupTable[transaction.recipientID]).toLowerCase();
	} else {
		actionLabel.text = App.Lib.Functions.getFirstName(friendLookupTable[transaction.senderID]).toLowerCase() + ": " + transactionWord.toLowerCase();
	}

	row.addEventListener("click", function() {
		Ti.UI.createAlertDialog({
			title : transactionWord,
			message : transactionDefinition
		}).show();
	});

	row.add(dateLabel);
	row.add(actionLabel);

	row.actionLabel = actionLabel;

	return row;

};

var buildRows = function() {

	var tableData = [];

	var currDate;
	var currHeader;

	App._.each(transactions, function(transaction) {

		var transactionMoment = App.moment(parseInt(transaction.time));

		if (!currDate) {

			currDate = transactionMoment;
			currHeader = Ti.UI.createTableViewSection({
				headerTitle : App.moment().isSame(currDate, "day") ? "today" : currDate.format("M/D/YYYY")
			});

		} else if (!currDate.isSame(transactionMoment, "day")) {

			tableData.push(currHeader);
			currDate = transactionMoment;
			currHeader = Ti.UI.createTableViewSection({
				headerTitle : currDate.format("M/D/YYYY")
			});

		}

		currHeader.add(buildHistoryRow(transaction));

	});

	if (tableData.length == 0) {
		tableData.push(currHeader);
	}

	ti.table.setData(tableData);

};

var updateTable = function() {

	transactions = App.Models.Transactions.all();
	transactions = App.Models.Transactions.sortTransactionsDescendingByTime(transactions);

	friendLookupTable = App.Models.User.getByName("friendsListLookup");

	buildRows();

};

var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	ti.tab = Ti.UI.createTab({
		window : ti.win,
		title : "exchanges",
		icon : "images/tab/exchange.png"
	});

	if (App.ANDROID) {

		ti.views.main.top = 50;

		ti.titleBar = App.UI.createAndroidTitleBar("Token");

		ti.titleBar.rightNavButton.title = "f";

		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.UI.Send.open(App.UI.Friends.getFriends());
		});

		ti.titleBar.rightNavButton.visible = true;

		ti.titleBar.leftNavButton.title = "Refresh";

		ti.titleBar.leftNavButton.addEventListener("click", function() {
			App.API.Transactions.syncTransactions(App.Models.User.getLastTransactionTime());
		});

		ti.titleBar.leftNavButton.visible = true;

		ti.win.add(ti.titleBar);

	} else {

		ti.win.leftNavButton = App.UI.createRefreshButton();
		ti.win.rightNavButton = ti.buttons.logout;

	}

	ti.views.main.add(ti.table);

	ti.views.main.add(App.UI.createSpacer());

	ti.win.add(ti.views.main);

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();

	Detail.initialize(app, ti.tab);

};

exports.getTab = function() {
	return ti.tab;
};

exports.updateTable = updateTable;

exports.refresh = function() {
	updateTable();
};
