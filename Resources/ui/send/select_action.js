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
			hasChild : false,
			selectedBackgroundColor : "white",
			backgroundColor : "white",
		}
	},
	table : {
		top : 5,
		minRowHeight : 35,
		width : "90%",
		height : Ti.UI.SIZE,
		borderWidth : 1,
		borderColor : "black",
		backgroundColor : "white",
		borderRadius : 4
	},
	labels : {
		title : {
			left : 20,
			top : 5,
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 17
			},
			text : "FOR"
		},
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
	buttons : {
		send : {
			top : 20,
			width : 150,
			height : 40,
			title : "send",
			color : "black",
			backgroundColor : "white",
			borderRadius : 4,
			borderWidth : 1,
			borderColor : "black",
			backgroundImage : null
		}
	},
	images : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {
		main : Ti.UI.createView(cfg.views.main)
	},
	labels : {
		title : Ti.UI.createLabel(cfg.labels.title)
	},
	buttons : {
		send : Ti.UI.createButton(cfg.buttons.send)
	},
	images : {}
};

actions = [];

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {
		var data = App.ANDROID ? e.source : e.rowData;
		if (data.action) {
			if (data.action == "add new") {
				ti.newActionWindow.open();
			} else {
				e.row.hasCheck = true;
				if (ti.table.lastRow && ti.table.lastRow != e.row) {
					ti.table.lastRow.hasCheck = false;
				}
				ti.table.lastRow = e.row;
				exchange.action = data.action;
			}
		}
	});

	ti.buttons.send.addEventListener("click", function(e) {

		if (!exchange.action) {
			Ti.UI.createAlertDialog({
				title : "",
				message : "Please select an action",
			}).show();
		} else {
			if (App.API.Transactions.getTransactionInProcess()) {
				return;
			}
			var now = new Date();
			App.UI.showWait("Sending...");
			if (friend.newFriend) {
				App.UI.Friends.addFriend(friend, true);
			}
			App.API.Transactions.addTransaction(friend.userID, exchange.action.name, exchange.tokens, now.getTime(), friend.name);
		}
	});

};

var addRow = function(action) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.action = action;

	row.label = Ti.UI.createLabel(cfg.labels.action);
	row.label.text = action.name.toLowerCase();

	row.add(row.label);

	return row;

};

var buildAddNewRow = function() {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.action = "add new";

	row.label = Ti.UI.createLabel(cfg.labels.action);
	row.label.font = {
		fontSize : 16
	};
	row.label.text = "+ add new";

	row.add(row.label);

	return row;

};

var buildRows = function() {

	App._.each(actions, function(action) {
		rowData.push(addRow(action));
	});

	rowData.push(buildAddNewRow());

};

var updateTable = exports.updateTable = function() {

	actions = App.Models.Transactions.getAllActions(friend.userID);
	actions = actions.concat(App.CONSTANTS.defaultActions);
	actions.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	ti.table.setData(rowData);

	if (rowData.length > 4) {
		ti.table.height = 162;
	} else {
		ti.table.height = Ti.UI.SIZE;
	}

	/*if (rowData.length == 0) {
	 ti.views.addNew.top = 0;
	 } else {
	 ti.views.addNew.top = 5;
	 }*/

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friend.userID + ".png");

	if (file.exists()) {
		ti.views.toView.profilePic.image = file;
	} else {
		ti.views.toView.profilePic.image = "/images/defaultprofile.png";
	}
};

var hasAction = function(name) {
	return App._.find(actions, function(action) {
		return action.name.toLowerCase() == name.toLowerCase();
	});
};

var addAction = function(name) {
	var action = {
		name : name
	};
	actions.push(action);
	var row = addRow(action);
	ti.table.insertRowBefore(actions.length-1, row);
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

	ti.views.toView = App.UI.createFriendRow("To");

	ti.views.main.add(ti.views.toView);

	ti.views.main.add(ti.labels.title);

	ti.views.main.add(ti.table);

	ti.views.main.add(ti.buttons.send);

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
	ti.views.toView.label.text = App.Lib.Functions.getShortName(friend.name.toLowerCase());
	updateTable();
	ti.newActionWindow.visible = false;
	App.UI.Send.openWindow(ti.win);
};

exports.getWin = function() {
	return ti.win;
};
