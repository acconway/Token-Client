var App;

var transactions;

Ti.include("/lib/lib_date.js");

var rowData = [];

var fonts = {
	black : "GoudySans Blk BT",
	bold : "GoudySans Md BT",
	book : "GoudySans LT Book",
	italic : "Goudy Sans",
	medium : "GoudySans Md BT Medium"
};

var cfg = {
	tab : "",
	win : {
		backgroundColor : "white",
		backgroundImage : "images/background.png",
		barColor : "#60a4b1",
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	},
	table : {
		top : 15,
		minRowHeight : 50,
		width : "90%",
		scrollable : false,
		touchEnabled : false,
		height : 0,
		borderWidth : 1,
		borderColor : "#f3e7da",
		backgroundColor : "#f3e7da",
		borderRadius : 4
	},
	views : {
		main : {
			height : "100%",
			width : "100%",
			layout : "vertical",
			showVerticalScrollIndicator : true,
			contentHeight : Ti.UI.SIZE,
			backgroundColor : "transparent"
		},
		historyRow : {
			width : "100%",
			height : 60,
			borderColor : "#f3e7da",
			backgroundColor : "#f3e7da",
			touchEnabled : false
		},
		topRow : {
			top : 0,
			left : 10,
			width : Ti.UI.SIZE,
			height : 40,
			layout : "horizontal"
		},
		bottomRow : {
			top : 40,
			left : 10,
			width : Ti.UI.SIZE,
			height : 40,
			layout : "horizontal"
		}
	},
	labels : {
		historyDate : {
			height : Ti.UI.SIZE,
			color : "#6292a1",
			font : {
				fontSize : 16,
				fontFamily : fonts.book
			},
			right : 5,
			width : Ti.UI.SIZE
		},
		historyTokens : {
			width : 200,
			height : Ti.UI.SIZE,
			left : 10,
			top : 10,
			color : "#6292a1",
			font : {
				fontSize : 16,
				fontFamily : fonts.italic
			}
		},
		historyAction : {
			left : 10,
			width : "90%",
			height : Ti.UI.SIZE,
			top : 30,
			color : "#6292a1",
			font : {
				fontSize : 16,
				fontFamily : fonts.italic
			}
		}
	},
	buttons : {
		refresh : {
			backgroundImage : "/images/icons/refresh@2x.png",
			width : 30,
			height : 30,
			left : 30
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main)
	},
	labels : {},
	buttons : {}
};

var buildNotificationRow = function(transaction) {

	var sent = (transaction.senderID == App.Models.User.getMyID());

	var row = Ti.UI.createTableViewRow(cfg.views.historyRow);

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var tokensLabel = Ti.UI.createLabel(cfg.labels.historyTokens);
	var actionLabel = Ti.UI.createLabel(cfg.labels.historyAction);

	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#");
	tokensLabel.text = transaction.tokenValue + " token" + (transaction.tokenValue > 1 ? "s" : "") + " exchanged for";
	actionLabel.text = transaction.actionName.toLowerCase();

	row.add(dateLabel);
	row.add(tokensLabel);
	row.add(actionLabel);

	row.tokensLabel = tokensLabel;
	row.actionLabel = actionLabel;

	return row;
};

var buildNotificationsTable = function() {

	rowData = [];
	ti.table.height = 0;

	App._.each(transactions, function(transaction) {
		rowData.push(buildNotificationRow(transaction));
		ti.table.height += (cfg.views.historyRow.height + (App.ANDROID ? 1 : 0));
	});

	ti.table.setData(rowData);

};

var refresh = function() {
	App.API.Transactions.syncTransactions(App.Models.User.getLastTransactionTime());
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

		ti.titleBar.rightNavButton.title = "Send";

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

		cfg.views.historyRow.backgroundSelectedColor = 'white';

	} else {

		ti.table.top = 15;

		//App.UI.addScrollToRefreshViewToTable(ti.table, refresh);

		ti.labels.titleControl = App.UI.getTitleControl();
		ti.labels.titleControl.text = "exchanges";
		ti.win.setTitleControl(ti.labels.titleControl);

		ti.win.rightNavButton = App.UI.createSendTokensButton();
		ti.win.leftNavButton = App.UI.createRefreshButton();

		cfg.views.historyRow.selectedBackgroundColor = 'white';
	}

	ti.views.main.add(ti.table);
	ti.views.main.add(App.UI.createSpacer());

	ti.win.add(ti.views.main);

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

exports.addRow = function(transaction) {

	var friendLookupTable = App.Models.User.getByName("friendsListLookup");

	if (App.ANDROID) {
		rowData.splice(0, 0, buildNotificationRow(transaction, friendLookupTable));
		ti.table.setData(rowData);
	} else {
		if (rowData.length > 0) {
			ti.table.insertRowBefore(0, buildNotificationRow(transaction, friendLookupTable));
		} else {
			ti.table.appendRow(buildNotificationRow(transaction, friendLookupTable));
		}
	}

};

exports.getTab = function() {
	return ti.tab;
};
