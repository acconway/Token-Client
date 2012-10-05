var App, actions = [], rowData = [];

var friend;

var NewAction = require("ui/widgets/new_action");

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
	},
	views : {
		main : {
			layout : "vertical",
			top : 0,
			height : "100%",
			width : "100%",
			backgroundColor : "transparent"
		},
		transaction : {
			height : 50,
			width : 200,
			top : 10,
			borderColor : "black",
			borderWidth : 1
		},
		row : {
			hasChild : true
		},
		addNew : {
			top : 20,
			height : 50,
			width : "90%",
			borderWidth : 1,
			borderColor : "black",
			borderRadius : 10,
			backgroundColor : "white"
		}
	},
	table : {
		top : 10,
		minRowHeight : 50,
		width : "90%",
		height : 225,
		borderWidth : 1,
		borderColor : "black",
		borderRadius : 10
	},
	labels : {
		friendName : {
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			color : "black",
			font : {
				fontSize : 18,
				fontWeight : "bold"
			}
		},
		title : {
			left : 10,
			top : 10,
			text : "Select an action",
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE
		},
		action : {
			font : {
				fontSize : 16,
				fontWeight : 'light'
			},
			left : 10,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black"
		},
		addNewFriend : {
			font : {
				fontSize : 16,
				fontWeight : 'bold'
			},
			left : 10,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black",
			text : "Add New Action"
		}
	},
	buttons : {},
	images : {
		addNew : {
			right : 10,
			width : 22,
			height : 22,
			image : "/images/icons/plus.png"
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {
		main : Ti.UI.createView(cfg.views.main),
		transaction : Ti.UI.createView(cfg.views.transaction)
	},
	labels : {
		friendName : Ti.UI.createLabel(cfg.labels.friendName),
		title : Ti.UI.createLabel(cfg.labels.title),
		addNew : Ti.UI.createLabel(cfg.labels.addNewFriend)
	},
	buttons : {},
	images : {
		addNew : Ti.UI.createImageView(cfg.images.addNew)
	}
};

actions = [];

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {

		var data = App.ANDROID ? e.source : e.rowData;
		if (data.action) {
			App.UI.Send.SelectTokens.open(friend, data.action);
		}
	});

	ti.views.addNew.addEventListener("click", function(e) {
		ti.newActionWindow.open();

	});

};

var addRow = function(action) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.action = action;

	row.label = Ti.UI.createLabel(cfg.labels.action);
	row.label.text = action.name;

	row.add(row.label);

	return row;

};

var buildAddNewRow = function() {

	ti.views.addNew = App.ANDROID ? Ti.UI.createView(cfg.views.addNew) : Ti.UI.createButton(cfg.views.addNew);

	ti.views.addNew.add(ti.labels.addNew);
	ti.views.addNew.add(ti.images.addNew);

};

var buildRows = function() {

	App._.each(actions, function(action) {
		rowData.push(addRow(action));
	});

};

var updateTable = exports.updateTable = function() {
	actions = App.Models.Transactions.getAllActions(friend.userID);
	actions.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	ti.table.setData(rowData);
};

var hasAction = function(name) {
	return App._.find(actions, function(action) {
		return action.name == name;
	})
};

var afterCreateNewAction = function(name) {
	if (hasAction(name)) {
		alert("You already have an action named " + name);
	} else {
		App.UI.Send.SelectTokens.open(friend, {
			name : name,
			lastValue : 0
		});
	}
};

var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;

		ti.titleBar = App.UI.createAndroidTitleBar("Send Tokens");

		ti.win.add(ti.titleBar);

		ti.views.main.top = 50;

	}

	ti.views.transaction.add(ti.labels.friendName);

	ti.views.main.add(ti.views.transaction);

	ti.views.main.add(ti.labels.title);

	ti.views.main.add(ti.table);
	
	buildAddNewRow();
	
	ti.views.main.add(ti.views.addNew);

	ti.win.backButtonTitle = "Back";

	ti.newActionWindow = NewAction.create(afterCreateNewAction);

	ti.win.add(ti.views.main);
	ti.win.add(ti.newActionWindow);

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.open = function(_friend) {
	friend = _friend;
	ti.labels.friendName.text = friend.name;
	updateTable();
	ti.newActionWindow.visible = false;
	App.UI.Send.openWindow(ti.win);
};

exports.getWin = function() {
	return ti.win;
};
