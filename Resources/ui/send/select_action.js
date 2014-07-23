var App, actions = [], rowData = [];

var friend;

var NewAction = require("ui/widgets/new_action");

var exchange = {
	tokens : 1,
	action : null
};

var cfg = {
	win : {
		backgroundColor : "white",
		title : "send"
	},
	views : {
		main : {
			layout : "vertical",
			top : 0,
			height : "100%",
			width : "100%",
			backgroundColor : "transparent"
		},
		row : {
			hasChild : true,
			selectedBackgroundColor : "white",
			backgroundColor : "white",
		}
	},
	table : {
		top : 5,
		minRowHeight : 35,
		width : "100%",
		height : "100%",
		backgroundColor : "white"
	},
	labels : {
		action : {
			left : 10,
			color : "black",
			font : {
				fontSize : 17
			},
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
		}
	},
	buttons : {},
	images : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {
		main : Ti.UI.createView(cfg.views.main)
	},
	labels : {},
	buttons : {},
	images : {}
};

actions = [];

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {
		var data = App.ANDROID ? e.source : e.rowData;
		if (data.action) {
			exchange.action = data.action;
			if (App.API.Transactions.getTransactionInProcess()) {
				return;
			}
			var now = new Date();
			App.UI.showWait("Sending...");
			if (friend.newFriend) {
				App.UI.Friends.addFriend(friend, true);
			}
			App.API.Transactions.addTransaction(friend.userID, exchange.action.word + ":" + exchange.action.definition, exchange.tokens, now.getTime(), friend.name);
		}
	});

	ti.table.addEventListener("longpress", function(e) {
		var data = App.ANDROID ? e.source : e.rowData;
		if (data.action) {
			Ti.UI.createAlertDialog({
				title : data.action.word,
				message : data.action.definition
			}).show();
		}
	});

};

var addRow = function(action) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.action = action;

	row.label = Ti.UI.createLabel(cfg.labels.action);
	row.label.text = action.word.toLowerCase();

	row.add(row.label);

	return row;

};

var buildRows = function() {

	App._.each(actions, function(action) {
		rowData.push(addRow(action));
	});

};

var updateTable = exports.updateTable = function() {

	var words = [];

	for (var i = 0; i < 8; i++) {
		var rand = Math.floor(Math.random() * (App.wordList.length - 1));
		words.push(App.wordList[rand]);
	}

	actions = words;
	actions.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	ti.table.setData(rowData);

};

var hasAction = function(name) {
	return App._.find(actions, function(action) {
		return action.word.toLowerCase() == name.toLowerCase();
	});
};

var addAction = function(name) {
	var action = {
		name : name
	};
	actions.push(action);
	var row = addRow(action);
	ti.table.insertRowBefore(actions.length - 1, row);
	ti.table.scrollToIndex(actions.length);
	row.hasCheck = true;
	if (ti.table.lastRow) {
		ti.table.lastRow.hasCheck = false;
	}
	ti.table.lastRow = row;
	exchange.action = action;
};

var afterCreateNewAction = function(name) {
	if (hasAction(name)) {
		Ti.UI.createAlertDialog({
			title : "",
			message : "You already have an action named " + name,
		}).show();
	} else {
		addAction(name);
	}
};

var buildHierarchy = function() {

	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;

		ti.titleBar = App.UI.createAndroidTitleBar("send");

		ti.win.add(ti.titleBar);

		ti.views.main.top = 50;

	}

	ti.views.main.add(ti.table);

	ti.win.backButtonTitle = "back";

	ti.newActionWindow = NewAction.create(afterCreateNewAction);

	ti.win.add(ti.views.main);
	ti.win.add(ti.newActionWindow);

};

exports.initialize = function(app) {
	App = app;
	NewAction.initialize(app);

	buildHierarchy();
	addEventListeners();
};

exports.open = function(_friend) {
	friend = _friend;
	ti.win.title = App.Lib.Functions.getShortName(friend.name.toLowerCase());
	updateTable();
	ti.newActionWindow.visible = false;
	App.UI.Send.openWindow(ti.win);
};

exports.getWin = function() {
	return ti.win;
};
