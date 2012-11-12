var App;

var currentData;

var friend;

Ti.include("/lib/lib_date.js");

var cfg = {
	win : {
		backgroundColor : "white",
		title : '',
		backgroundColor : "#DBDBDB",
		barColor : "#6b8a8c"
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
			top : 15,
			width : "90%",
			borderColor : "white",
			borderRadius : 2,
			height : 75,
			backgroundColor : "white"
		},
		balanceBar1 : {
			height : 19,
			width : 0,
			top : 11,
			borderRadius : 2,
			left : 90,
			backgroundColor : "lightgray",
			borderColor : "black",
			borderWidth : 1
		},
		balanceLine : {
			width : 1,
			height : 19,
			backgroundColor : "black"
		},
		balanceBar2 : {
			height : 19,
			width : 0,
			borderRadius : 2,
			top : 46,
			left : 90,
			borderColor : "black",
			borderWidth : 1,
			backgroundColor : "lightgray"
		},
		historyTable : {
			top : 15,
			height : 0,
			scrollable : false,
			width : "90%",
			borderColor : "white",
			borderRadius : 2,
			backgroundColor : "white"
		},
		historyRow : {
			width : "100%",
			height : 70,
			touchEnabled : false
		},
		historyLabelView : {
			width : 140,
			height : 60,
			right : 0
		}
	},
	labels : {
		balanceTitle : {
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
			text : "Tokens:"
		},
		balance : {
			top : 5,
			left : 10,
			height : 30,
			color : "black",
			width : 75,
			ellipsize : true,
			font : {
				fontSize : 17,
				fontWeight : "light"
			}
		},
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
			text : "Exchanges:"
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
			height : 20,
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
	buttons : {},
	images : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main),
		padding : Ti.UI.createView(cfg.views.padding),
		balance : Ti.UI.createView(cfg.views.balance),
		balanceBar1 : Ti.UI.createView(cfg.views.balanceBar1),
		balanceBar2 : Ti.UI.createView(cfg.views.balanceBar2),
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

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var tokensLabel = Ti.UI.createLabel(cfg.labels.historyTokens);
	var actionLabel = Ti.UI.createLabel(cfg.labels.historyAction);

	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#");
	tokensLabel.text = "You " + ( sent ? "sent" : "received") + " " + transaction.tokenValue + " Token" + (transaction.tokenValue > 1 ? "s" : "");
	actionLabel.text = "For \"" + transaction.actionName + "\"";

	row.add(dateLabel);
	row.add(tokensLabel);
	row.add(actionLabel);

	row.tokensLabel = tokensLabel;
	row.actionLabel = actionLabel;

	return row;

};

var buildBalanceView = function() {

	ti.labels.friendBalance.top = 40;

	ti.views.balance.add(ti.labels.myBalance);
	ti.views.balance.add(ti.labels.friendBalance);
	ti.views.balance.add(ti.views.balanceBar1);
	ti.views.balance.add(ti.views.balanceBar2);

};

var refreshTable = function() {

	ti.views.historyTable.height = 0; 
	
	var tableData = [];

	App._.each(currentData.transactions, function(transaction) {
		tableData.push(addHistoryRow(transaction));
		ti.views.historyTable.height += (cfg.views.historyRow.height + (App.ANDROID?1:0));
	});

	ti.views.historyTable.setData(tableData);

};

var addBalanceLine = function(balance, bar) {
	if (balance && bar) {
		for (var i = 1; i < balance; i++) {
			var line = Ti.UI.createView(cfg.views.balanceLine);
			line.left = i * (190 / App.CONSTANTS.TOTALPOINTS);
			line.top = 0
			bar.add(line);
		}
	}
};

var refreshBalance = function() {

	var myBalance = currentData.myBalance;

	var friendBalance = App.CONSTANTS.TOTALPOINTS - myBalance;

	ti.labels.myBalance.text = "You:";
	ti.labels.friendBalance.text = App.Lib.Functions.getFirstName(friend.name) + ":";

	ti.views.balance.remove(ti.views.balanceBar1);
	ti.views.balance.remove(ti.views.balanceBar2);

	ti.views.balanceBar1 = Ti.UI.createView(cfg.views.balanceBar1);
	ti.views.balanceBar2 = Ti.UI.createView(cfg.views.balanceBar2);

	ti.views.balance.add(ti.views.balanceBar1);
	ti.views.balance.add(ti.views.balanceBar2);

	ti.views.balanceBar1.width = myBalance * (190 / App.CONSTANTS.TOTALPOINTS);
	ti.views.balanceBar2.width = friendBalance * (190 / App.CONSTANTS.TOTALPOINTS);

	addBalanceLine(myBalance, ti.views.balanceBar1);
	addBalanceLine(friendBalance, ti.views.balanceBar2);

};

var update = function(_friend) {

	friend = _friend;

	currentData = App.Models.Transactions.getAllTransactionsWithFriendAndBalance(friend.userID);

	ti.views.friend.label.text = App.Lib.Functions.getShortName(friend.name);

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friend.userID + ".png");

	if (file.exists()) {
		ti.views.friend.profilePic.image = file;
	}else{
		ti.views.friend.profilePic.image = null; 
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

	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;
		ti.views.main.top = 50;

		ti.titleBar = App.UI.createAndroidTitleBar();

		ti.titleBar.rightNavButton.title = "Send";
		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.UI.Send.SelectAction.open(friend);
		});
		ti.titleBar.rightNavButton.visible = true;

		ti.win.add(ti.titleBar);

	} else {

		cfg.views.historyRow.selectedBackgroundColor = 'white';
		ti.win.backButtonTitle = "Back";

		var button = App.UI.createSendTokensActionsButton();

		button.addEventListener("click", function() {
			App.UI.Send.open(App.UI.Friends.getFriends());
			App.UI.Send.SelectAction.open(friend);
		});

		ti.win.rightNavButton = button;

	}

	ti.views.friend = App.UI.createFriendRow();

	ti.views.main.add(ti.views.friend);

	buildBalanceView();
	ti.views.main.add(ti.labels.balanceTitle);
	ti.views.main.add(ti.views.balance);
	ti.views.main.add(ti.labels.historyTitle);
	ti.views.main.add(ti.views.historyTable);
	ti.views.main.add(App.UI.createSpacer());
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
