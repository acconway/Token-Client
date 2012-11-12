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
		scrollable : false,
		height : 0,
		borderWidth : 1,
		borderColor : "white",
		backgroundColor : "white",
		borderRadius : 2
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
		historyRow : {
			height : 110,
			className : "row",
			touchEnabled : false
		},
	},
	labels : {
		exchanges : {
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
			text : "Your Exchanges:"
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
		historyTo : {
			left : 10,
			width : 40,
			height : 20,
			top : 45,
			color : "black",
			font : {
				fontSize : 17,
				fontWeight : "light"
			}
		},
		historyFriend : {
			left : 80,
			width : Ti.UI.SIZE,
			height : 25,
			top : 40,
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
			top : 80,
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
			right : 105
		},
		logout : {
			title : "Logout",
			height : 30,
			width : 200
		}
	},
	images : {
		profilePic : {
			top : 40,
			left : 50,
			width : 30,
			height : 30
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main)
	},
	labels : {
		exchanges : Ti.UI.createLabel(cfg.labels.exchanges)
	},
	buttons : {
		logout : Ti.UI.createButton(cfg.buttons.logout)
	}
};

var buildNotificationRow = function(transaction, friendLookupTable) {

	var sent = (transaction.senderID == App.Models.User.getMyID());
	var friendID = sent ? transaction.recipientID : transaction.senderID;

	var row = Ti.UI.createTableViewRow(cfg.views.historyRow);

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var tokensLabel = Ti.UI.createLabel(cfg.labels.historyTokens);
	var toLabel = Ti.UI.createLabel(cfg.labels.historyTo);
	var profilePic = Ti.UI.createImageView(cfg.images.profilePic);
	var friendNameLabel = Ti.UI.createLabel(cfg.labels.historyFriend);
	var actionLabel = Ti.UI.createLabel(cfg.labels.historyAction);

	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#");
	tokensLabel.text = ( sent ? "Sent" : "Received") + " " + transaction.tokenValue + " Token" + (transaction.tokenValue > 1 ? "s" : "");
	toLabel.text = ( sent ? "To" : "From");
	friendNameLabel.text = App.Lib.Functions.getShortName(friendLookupTable[friendID]);
	actionLabel.text = "For \"" + transaction.actionName + "\"";

	profilePic.left = sent ? 40 : 60;
	friendNameLabel.left = sent ? 80 : 100;

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friendID + ".png");

	if (file.exists()) {
		profilePic.image = file;
	} else {
		profilePic.image = "/images/defaultprofile.png";
	}

	row.add(dateLabel);
	row.add(tokensLabel);
	row.add(toLabel);
	row.add(profilePic);
	row.add(friendNameLabel);
	row.add(actionLabel);

	row.image = profilePic;

	row.tokensLabel = tokensLabel;
	row.actionLabel = actionLabel;

	row.friend = {
		userID : friendID
	};

	return row;
};

var buildNotificationsTable = function() {

	var friendLookupTable = App.Models.User.getByName("friendsListLookup");

	rowData = [];
	ti.table.height = 0;

	App._.each(transactions, function(transaction) {
		rowData.push(buildNotificationRow(transaction, friendLookupTable));
		ti.table.height += (cfg.views.historyRow.height + (App.ANDROID ? 1 : 0));
	});

	ti.table.setData(rowData);

};

var refresh = function() {
	App.API.Transactions.syncTransactions(App.Models.User.getLastTransactionTime(), ti.table.afterRefresh);
};

var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	ti.tab = Ti.UI.createTab({
		window : ti.win,
		title : "User",
		icon : "images/icons/tabs/user.png"
	});

	ti.views.user = App.UI.createFriendRow();

	if (App.ANDROID) {

		ti.views.main.top = 50;

		ti.table.top = 15;

		ti.titleBar = App.UI.createAndroidTitleBar("Token");

		ti.titleBar.rightNavButton.title = "Logout";

		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.logout();
		});

		ti.titleBar.rightNavButton.visible = true;

		ti.titleBar.leftNavButton.title = "Refresh";

		ti.titleBar.leftNavButton.addEventListener("click", function() {
			App.API.Transactions.syncTransactions(App.Models.User.getLastTransactionTime());
		});

		ti.titleBar.leftNavButton.visible = true;

		ti.win.add(ti.titleBar);

	} else {

		ti.table.top = 15;

		ti.win.rightNavButton = ti.buttons.logout;
		ti.win.leftNavButton = App.UI.createRefreshButton();

	}

	ti.views.main.add(ti.views.user);
	ti.views.main.add(ti.labels.exchanges);
	ti.views.main.add(ti.table);
	ti.views.main.add(App.UI.createSpacer());

	ti.win.add(ti.views.main);
};

var addEventListeners = function() {
	ti.buttons.logout.addEventListener("click", function() {
		App.logout();
	});
};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.setProfilePicture = function(file) {
	if (file.exists()) {
		ti.views.user.profilePic.image = file;
	} else {
		ti.views.user.profilePic.image = "/images/defaultprofile.png";
	}

};

exports.refreshPictures = function(index) {

	App._.each(rowData, function(row) {
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", row.friend.userID + ".png");

		if (file.exists()) {
			row.image.image = file;
		} else {
			row.image.image = "/images/defaultprofile.png";
		}

	});

};

var updateTable = exports.updateTable = function() {

	var myID = App.Models.User.getMyID();

	transactions = App.Models.Transactions.all();

	transactions = App._.filter(transactions, function(transaction) {
		return (transaction.senderID == myID || transaction.recipientID == myID);
	});

	transactions = App.Models.Transactions.sortTransactionsDescendingByTime(transactions);

	buildNotificationsTable();

	ti.views.user.label.text = App.Lib.Functions.getShortName(App.Models.User.getMyName());

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", "me.png");

	if (file.exists()) {
		ti.views.user.profilePic.image = file;
	} else {
		ti.views.user.profilePic.image = "/images/defaultprofile.png";
	}

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

	ti.table.height += cfg.views.historyRow.height + App.ANDROID ? 1 : 0;

};

exports.getTab = function() {
	return ti.tab;
};
