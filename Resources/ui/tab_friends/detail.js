var App;

var currentData;

var friend;
var friendLookupTable;

Ti.include("/lib/lib_date.js");

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
			top : 0,
			height : "100%",
			width : "100%",
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
	buttons : {
		send : {
			width : 25,
			height : 25,
			right : 10,
			title : "send"
		}
	},
	images : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main),
		padding : Ti.UI.createView(cfg.views.padding),
		historyTable : Ti.UI.createTableView(cfg.views.historyTable)
	},
	labels : {},
	buttons : {
		send : Ti.UI.createButton(cfg.buttons.send)
	},
	images : {}
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
	actionLabel.text = App.Lib.Functions.getFirstName( sent ? App.Models.User.getMyName() : friendLookupTable[transaction.senderID]).toLowerCase() + ": " + transactionWord.toLowerCase();

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

var refreshTable = function() {

	var tableData = [];

	var currDate;
	var currHeader;

	App._.each(currentData.transactions, function(transaction) {

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

	ti.views.historyTable.setData(tableData);

};

var update = function(_friend) {

	friendLookupTable = App.Models.User.getByName("friendsListLookup");

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
		//ti.win.rightNavButton = ti.buttons.send;

	}

	ti.views.main.add(ti.views.historyTable);
	ti.views.main.add(App.UI.createSpacer());
	ti.win.add(ti.views.main);

};

var addEventListeners = function() {

	ti.buttons.send.addEventListener("click", function() {
		App.UI.Send.SelectAction.open(friend);
	});

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
