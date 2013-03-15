var App;

var transactions;

Ti.include("/lib/lib_date.js");

var rowData = [];

var cfg = {
	tab : "",
	win : {
		backgroundColor : "white",
		title : "Token",
		barColor : "6b8a8c",
		backgroundColor : "#DBDBDB",
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	},
	table : {
		top : 15,
		minRowHeight : 50,
		width : "90%",
		scrollable:false, 
		touchEnabled:false,
		height : 0,
		borderWidth : 1,
		borderColor : "white",
		backgroundColor : "white",
		borderRadius : 2
	},
	views : {
		main:{
			height:"100%",
			width:"100%",
			layout:"vertical",
			showVerticalScrollIndicator:true,
			contentHeight:Ti.UI.SIZE,
			backgroundColor:"transparent"
		},
		historyRow : {
			width : "100%",
			height : 70,
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
		historyTitle : {
			left : 10,
			top : 15,
			text : "To:",
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 16,
				fontWeight : "bold"
			},
			text : "All Exchanges:"
		},
			historyDate : {
			width : Ti.UI.SIZE,
			height : 20,
			right : 10,
			top : 10,
			color : "black",
			font : {
				fontSize : 17,
				fontWeight : "light"
			}
		},
		historyTokens : {
			width : 200,
			height : 25,
			left : 10,
			top : 10,
			color : "black",
			font : {
				fontSize : 17,
				fontWeight : "light"
			}
		},
		historyAction : {
			left : 10,
			width : "90%",
			height : 25,
			top : 40,
			color : "black",
			font : {
				fontSize : 17,
				fontWeight : "light"
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
			main: Ti.UI.createScrollView(cfg.views.main)
	},
	labels : {
		historyTitle:Ti.UI.createLabel(cfg.labels.historyTitle)
	},
	buttons : {}
};

var buildNotificationRow = function(transaction) {

	var sent = (transaction.senderID == App.Models.User.getMyID());

	var row = Ti.UI.createTableViewRow(cfg.views.historyRow);

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var tokensLabel = Ti.UI.createLabel(cfg.labels.historyTokens);
	var actionLabel = Ti.UI.createLabel(cfg.labels.historyAction);

	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#");
	tokensLabel.text = transaction.tokenValue + " Token" + (transaction.tokenValue > 1 ? "s" : "")+" Exchanged";
	actionLabel.text = "For \"" + transaction.actionName + "\"";

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
		ti.table.height += (cfg.views.historyRow.height+(App.ANDROID?1:0)); 
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
		title : "Exchanges",
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

		App.UI.addScrollToRefreshViewToTable(ti.table, refresh);

		ti.win.rightNavButton = App.UI.createSendTokensButton();
		ti.win.leftNavButton = App.UI.createRefreshButton(); 
		
		cfg.views.historyRow.selectedBackgroundColor = 'white';
	}
	
	ti.views.main.add(ti.labels.historyTitle);
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
