var App;

var transactions;

Ti.include("/lib/lib_date.js");

var rowData = [];

var cfg = {
	tab : "",
	win : {
		backgroundColor : "white",
		title : "Token",
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	},
	table : {
		minRowHeight : 50,
		separatorColor : "black"
	},
	views : {
		row : {
			height : 80,
			className : "row"
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
		date : {
			width : Ti.UI.SIZE,
			height : 40,
			left : 0,
			color : "black",
			font : {
				fontSize : 16
			}
		},
		tokens : {
			left : 30,
			width : Ti.UI.SIZE,
			height : 40,
			color : "black",
			font : {
				fontSize : 16
			}
		},
		direction : {
			width : Ti.UI.SIZE,
			height : 40,
			left : 0,
			color : "black",
			font : {
				fontSize : 16,
				fontWeight : "bold"
			}
		},
		name : {
			left : 5,
			width : Ti.UI.SIZE,
			height : 40,
			color : "black",
			font : {
				fontSize : 16
			}
		},
		forLabel : {
			left : 10,
			width : Ti.UI.SIZE,
			height : 40,
			color : "black",
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
			color : "black",
			font : {
				fontSize : 16
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
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {},
	labels : {},
	buttons : {
		logout : Ti.UI.createButton(cfg.buttons.logout)
	}
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
	tokensLabel.text = ( sent ? "Sent" : "Received") + " " + transaction.tokenValue + " Token" + (transaction.tokenValue > 1 ? "s" : "");
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

	rowData = [];

	App._.each(transactions, function(transaction) {
		rowData.push(buildNotificationRow(transaction, friendLookupTable));
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

	if (App.ANDROID) {

		cfg.views.row.backgroundSelectedColor = 'white';

		ti.table.top = 50;

		ti.titleBar = App.UI.createAndroidTitleBar("Token");

		ti.titleBar.rightNavButton.title = "logout";

		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.logout();
		});
	
		ti.titleBar.rightNavButton.visible = true; 


		ti.win.add(ti.titleBar);

	} else {

		cfg.views.row.selectedBackgroundColor = 'white';

		ti.table.top = 0;
		
		ti.win.rightNavButton = ti.buttons.logout; 

	}

	ti.win.add(ti.table);

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

var updateTable = exports.updateTable = function() {
	
	var myID = App.Models.User.getMyID();

	transactions = App.Models.Transactions.all();
	
	transactions = App._.filter(transactions,function(transaction){
		return (transaction.senderID == myID || transaction.recipientID == myID); 
	});

	transactions = App.Models.Transactions.sortTransactionsDescendingByTime(transactions);

	buildNotificationsTable();

};

exports.addRow = function(transaction) {

	var friendLookupTable = App.Models.User.getByName("friendsListLookup");

	if (App.ANDROID) {
		rowData.splice(0, 0, buildNotificationRow(transaction, friendLookupTable));
		ti.table.setData(rowData);
	} else {
		ti.table.insertRowBefore(0, buildNotificationRow(transaction, friendLookupTable));
	}

};

exports.getTab = function() {
	return ti.tab;
};
