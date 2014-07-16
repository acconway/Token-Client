var App;

var transactions;

Ti.include("/lib/lib_date.js");

var rowData = [];

var cfg = {
	tab : "",
	win : {
		title : "user",
		backgroundColor : "white",
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	},
	table : {
		top : 15,
		minRowHeight : 50,
		width : "100%",
		height : "Ti.UI.FILL",
		backgroundColor : "white"
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
			height : 50,
			backgroundColor : "white",
			className : "row",
			touchEnabled : false
		},
	},
	labels : {
		historyDate : {
			height : Ti.UI.SIZE,
			color : "#6292a1",
			font : {
				fontSize : 17
			},
			right : 5,
			width : Ti.UI.SIZE
		},
		historyName : {
			width : 200,
			height : Ti.UI.SIZE,
			left : 65,
			top : 3,
			color : "black",
			font : {
				fontSize : 15
			}
		},
		historyAction : {
			left : 65,
			width : "90%",
			height : Ti.UI.SIZE,
			top : 24,
			color : "black",
			font : {
				fontSize : 15
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
			title : "logout",
			height : 30,
			width : 200
		}
	},
	images : {
		profilePic : {
			left : 5,
			height : 40,
			width : 40,
			borderRadius : 4
		},
		historyIcon : {
			width : 25,
			height : 16,
			top : 10,
			right : 8
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
	var nameLabel = Ti.UI.createLabel(cfg.labels.historyName);
	var profilePic = Ti.UI.createImageView(cfg.images.profilePic);
	var actionLabel = Ti.UI.createLabel(cfg.labels.historyAction);

	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#");
	nameLabel.text = App.Lib.Functions.getShortName(friendLookupTable[friendID]).toLowerCase() + ( sent ? " sent" : " received");
	actionLabel.text = '"' + transaction.actionName.toLowerCase() + '"';

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friendID + ".png");

	if (file.exists()) {
		profilePic.image = file;
	} else {
		profilePic.image = "/images/defaultprofile.png";
	}

	row.add(dateLabel);
	row.add(nameLabel);
	row.add(profilePic);
	row.add(actionLabel);

	row.image = profilePic;

	row.nameLabel = nameLabel;
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
	App.API.Transactions.syncTransactions(App.Models.User.getLastTransactionTime());
};

var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	ti.tab = Ti.UI.createTab({
		window : ti.win,
		title : "user",
		icon : "images/tab/profile.png"
	});

	ti.views.user = App.UI.createFriendRow();

	ti.views.user.top = 10;

	if (App.ANDROID) {

		ti.views.main.top = 50;

		ti.table.top = 15;

		ti.titleBar = App.UI.createAndroidTitleBar("Token");

		ti.titleBar.rightNavButton.title = "logout";

		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.logout();
		});

		ti.titleBar.rightNavButton.visible = true;

		ti.titleBar.leftNavButton.title = "refresh";

		ti.titleBar.leftNavButton.addEventListener("click", function() {
			App.API.Transactions.syncTransactions(App.Models.User.getLastTransactionTime());
		});

		ti.titleBar.leftNavButton.visible = true;

		ti.win.add(ti.titleBar);

		cfg.views.historyRow.backgroundSelectedColor = "white";

	} else {

		ti.table.top = 15;

		ti.win.rightNavButton = ti.buttons.logout;
		ti.win.leftNavButton = App.UI.createRefreshButton();
		cfg.views.historyRow.selectedBackgroundColor = "white";

	}

	ti.views.getStarted = App.UI.createGetStartedRow();

	ti.views.main.add(ti.views.user);
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

	ti.views.user.label.text = App.Lib.Functions.getShortName(App.Models.User.getMyName()).toLowerCase();

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", "me.png");

	if (file.exists()) {
		ti.views.user.profilePic.image = file;
	} else {
		ti.views.user.profilePic.image = "/images/defaultprofile.png";
	}

	if (rowData.length == 0) {
		if (ti.views.getStarted.visible == false) {
			ti.views.main.add(ti.views.getStarted);
			ti.views.getStarted.visible = true;
		}
	} else {
		if (ti.views.getStarted.visible) {
			ti.views.main.remove(ti.views.getStarted);
			ti.views.getStarted.visible = false;
		}
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
