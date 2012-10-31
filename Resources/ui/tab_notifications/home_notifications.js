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
			className:"row"
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
			top:5,
			height : 30,
			left : 10,
			color : "black",
			font : {
				fontSize : 13
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
			left:30
		}
	}
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

	var dateLabel = Ti.UI.createLabel(cfg.labels.date);
	var tokensLabel = Ti.UI.createLabel({
		top:35,
		width:"100%",
		color:"black",
		textAlign:"center",
		font:{
			fontSize:16
		},
		height:Ti.UI.SIZE
	});
	
	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#/#YYYY#");	
	tokensLabel.text= transaction.tokenValue + " Token" + (transaction.tokenValue > 1 ? "s" : "") + " exchanged for "+transaction.actionName; 

	row.add(dateLabel);
	row.add(tokensLabel);

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
		title : "Exchanges",
		icon : "images/icons/tabs/notifications.png"
	});

	if (App.ANDROID) {

		cfg.views.row.backgroundSelectedColor = 'white';

		ti.table.top = 50;

		ti.titleBar = App.UI.createAndroidTitleBar("Token");

		ti.titleBar.rightNavButton.title = "Send";

		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.UI.Send.open(App.UI.Friends.getFriends());
		});

		ti.titleBar.rightNavButton.visible = true;

		var refreshButton = Ti.UI.createButton(cfg.buttons.refresh);
		
		refreshButton.backgroundColor = "gray";
		refreshButton.borderColor = "black";
		refreshButton.borderWidth = 1; 
		refreshButton.borderRadius = 5; 

		refreshButton.addEventListener("click", function() {
			refresh();
		});

		ti.titleBar.add(refreshButton);

		ti.win.add(ti.titleBar);

	} else {

		cfg.views.row.selectedBackgroundColor = 'white';

		ti.table.top = 0;

		App.UI.addScrollToRefreshViewToTable(ti.table, refresh);

		ti.win.rightNavButton = App.UI.createSendTokensButton();

	}

	ti.win.add(ti.table);

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
	
	if(App.ANDROID){
		rowData.splice(0,0,buildNotificationRow(transaction, friendLookupTable));
		ti.table.setData(rowData);
	}else{
		if(rowData.length>0){
			ti.table.insertRowBefore(0, buildNotificationRow(transaction, friendLookupTable));
		}else{
			ti.table.appendRow(buildNotificationRow(transaction, friendLookupTable));
		}
	}

};

exports.getTab = function() {
	return ti.tab;
};
