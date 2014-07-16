var App;

var currentData;

var friend;

Ti.include("/lib/lib_date.js");

var fonts = {
	black : "GoudySans Blk BT",
	bold : "GoudySans Md BT",
	book : "GoudySans LT Book",
	italic : "Goudy Sans",
	medium : "GoudySans Md BT Medium"
};

var cfg = {
	win : {
		backgroundColor : "white",
		title : '',
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
			top : 5,
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
		historyTable : {
			top : 5,
			height : 0,
			scrollable : false,
			width : "90%",
			borderColor : "black",
			borderRadius : 4,
			borderWidth : 1,
			backgroundColor : "white"
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
	labels : {
		historyTitle : {
			left : 20,
			top : 5,
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 17,
			},
			text : "History"
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
	buttons : {},
	images : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main),
		padding : Ti.UI.createView(cfg.views.padding),
		historyTable : Ti.UI.createTableView(cfg.views.historyTable)
	},
	labels : {
		historyTitle : Ti.UI.createLabel(cfg.labels.historyTitle),
	},
	buttons : {},
	images : {}
};

var buildHistoryRow = function(transaction) {

	var sent = (transaction.senderID == App.Models.User.getMyID());

	var row = Ti.UI.createTableViewRow(cfg.views.historyRow);

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var actionLabel = Ti.UI.createLabel(cfg.labels.historyAction);

	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#");
	actionLabel.text = ( sent ? "you" : "they") + " sent " + transaction.actionName.toLowerCase();

	row.add(dateLabel);
	row.add(actionLabel);

	row.actionLabel = actionLabel;

	return row;

};

var refreshTable = function() {

	ti.views.historyTable.height = 0;

	var tableData = [];

	App._.each(currentData.transactions, function(transaction) {
		tableData.push(buildHistoryRow(transaction));
		ti.views.historyTable.height += (cfg.views.historyRow.height + (App.ANDROID ? 1 : 0));
	});

	ti.views.historyTable.setData(tableData);

};

var update = function(_friend) {

	friend = _friend;

	currentData = App.Models.Transactions.getAllTransactionsWithFriendAndBalance(friend.userID);

	ti.win.title = friend.name.toLowerCase();

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

		cfg.views.historyRow.backgroundSelectedColor = 'white';

		ti.titleBar.rightNavButton.title = "Send";
		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.UI.Send.SelectAction.open(friend);
		});
		ti.titleBar.rightNavButton.visible = true;

		ti.win.add(ti.titleBar);

	} else {

		cfg.views.historyRow.selectedBackgroundColor = 'white';
		ti.win.backButtonTitle = "back";

		var button = Ti.UI.createButton({
			width : 25,
			height : 25,
			right : 10,
			title : "send",
			font : {
				fontWeight : "bold",
				fontSize : 40
			}
		});

		button.addEventListener("click", function() {
			App.UI.Send.SelectAction.open(friend);
		});
		ti.win.rightNavButton = button;
	}

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