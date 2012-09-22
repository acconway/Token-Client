var App;

var currentData;

var friend = friend;

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
			contentHeight : Ti.UI.SIZE,
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
			width : 288,
			scrollable : false,
			borderRadius : 10,
			borderColor : "black",
			borderWidth : 1,
			backgroundColor : "white"
		},
		historyRow : {
			width : "100%",
			height : 60,
			touchEnabled : false
		},
		historyLabelView : {
			width : 140,
			height : 60,
			right : 0
		},
		forView : {
			width : 120,
			height : 30,
			top : 30,
			left : 0,
			layout : "horizontal"
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
			color : "black",
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
			height : 70,
			left : 10,
			color : "black",
			font : {
				fontSize : 14
			}
		},
		historyTokens : {
			width : Ti.UI.SIZE,
			height : 30,
			left : 0,
			top : 0,
			color : "black",
			font : {
				fontSize : 14
			}
		},
		historyFor : {
			left : 0,
			width : Ti.UI.SIZE,
			height : 30,
			text : "For:",
			color : "black",
			font : {
				fontSize : 14
			}
		},
		historyAction : {
			left : 5,
			width : Ti.UI.SIZE,
			height : 30,
			color : "black",
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

var addHistoryRow = function(transaction) {

	var sent = (transaction.senderID == App.Models.User.getMyID());

	var row = Ti.UI.createTableViewRow(cfg.views.historyRow);

	var view = Ti.UI.createView(cfg.views.historyLabelView);
	var forView = Ti.UI.createView(cfg.views.forView);

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var tokensLabel = Ti.UI.createLabel(cfg.labels.historyTokens);
	var forLabel = Ti.UI.createLabel(cfg.labels.historyFor);
	var actionLabel = Ti.UI.createLabel(cfg.labels.historyAction);

	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#/#YYYY#");
	tokensLabel.text = ( sent ? "Sent" : "Received") + " " + transaction.tokenValue + " Token" + (transaction.tokenValue > 1 ? "s" : "");
	actionLabel.text = transaction.actionName;

	forView.add(forLabel);
	forView.add(actionLabel);

	view.add(tokensLabel);
	view.add(forView);

	row.add(dateLabel);
	row.add(view);

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
	
	ti.views.historyTable.height = 0; 

	var tableData = [];

	App._.each(currentData.transactions, function(transaction) {
		tableData.push(addHistoryRow(transaction));
		ti.views.historyTable.height += cfg.views.historyRow.height;
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

	if (App.ANDROID) {
		ti.titleBar.label.text = friend.name;
	} else {
		ti.win.title = friend.name;
	}

	refreshBalance();

	refreshTable();

};

exports.open = function(_friend) {
	friend = _friend;
	update(friend);
	ti.tab.open(ti.win);
};

var buildHierarchy = function() {

	if (App.ANDROID) {
		
		ti.win.navBarHidden = true;
		ti.views.main.top = 50;
		cfg.views.historyRow.backgroundSelectedColor = 'white';
		
		ti.titleBar = App.UI.createAndroidTitleBar();

		ti.titleBar.rightNavButton.title = "Send";
		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.UI.Send.open(App.UI.Friends.getFriends());
		});
		ti.titleBar.rightNavButton.visible = true;
		
		ti.win.add(ti.titleBar);
	} else {
		cfg.views.historyRow.selectedBackgroundColor = 'white';
		ti.win.backButtonTitle = "Back";
		ti.win.rightNavButton = App.UI.createSendTokensButton();
	}

	buildBalanceView();
	ti.views.main.add(ti.labels.balanceTitle);
	ti.views.main.add(ti.views.balance);
	ti.views.main.add(ti.labels.historyTitle);
	ti.views.main.add(ti.views.historyTable);
	ti.win.add(ti.views.main);

};

var addEventListeners = function() {
};

exports.update = function() {
	if (friend) {
		update(friend);
	}
};

exports.initialize = function(app, tab) {
	App = app;
	ti.tab = tab;
	buildHierarchy();
	addEventListeners();
};
