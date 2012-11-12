var App, actions = [], rowData = [];

var friend;

var NewAction = require("ui/widgets/new_action");

var cfg = {
	win : {
		backgroundColor : "white",
		barColor : "6b8a8c",
		backgroundColor : "#DBDBDB",
		title : "Send Tokens"
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
			selectedBackgroundColor : "#a4b5ac"
		},
		addNew : {
			top : 15,
			height : 50,
			backgroundImage : 'none',
			backgroundColor : "white",
			width : "90%"
		}
	},
	table : {
		top : 15,
		minRowHeight : 50,
		width : "90%",
		height : Ti.UI.SIZE,
		borderWidth : 1,
		borderColor : "white",
		backgroundColor : "white",
		borderRadius : 2
	},
	labels : {
		title : {
			left : 10,
			top : 15,
			text : "For:",
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 16,
				fontWeight : "bold"
			}
		},
		action : {
			font : {
				fontSize : 18,
				fontWeight : 'light'
			},
			left : 10,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black"
		},
		addNewFriend : {
			font : {
				fontSize : 18,
				fontWeight : 'light'
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
	},
	labels : {
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

	ti.views.addNew = Ti.UI.createView(cfg.views.addNew);

	ti.views.addNew.backgroundColor = "white";
	ti.views.addNew.add(ti.labels.addNew);
	ti.views.addNew.add(ti.images.addNew);

	ti.views.addNew.addEventListener("touchstart", function() {
		ti.views.addNew.backgroundColor = "#a4b5ac";
	});
	
	ti.views.addNew.addEventListener("touchend", function() {
		ti.views.addNew.backgroundColor = "white";
	});

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

	if (rowData.length > 3) {
		ti.table.height = 175;
	} else {
		ti.table.height = Ti.UI.SIZE;
	}

	if (rowData.length == 0) {
		ti.views.addNew.top = 0;
	} else {
		ti.views.addNew.top = 15;
	}

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friend.userID + ".png");

	if (file.exists()) {
		ti.views.toView.profilePic.image = file;
	}else{
		ti.views.toView.profilePic.image = null; 
	}
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

	ti.views.toView = App.UI.createFriendRow("To");
	
	ti.views.main.add(ti.views.toView);

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
	NewAction.initialize(app);

	buildHierarchy();
	addEventListeners();
};

exports.open = function(_friend) {
	friend = _friend;
	ti.views.toView.label.text = App.Lib.Functions.getShortName(friend.name);
	updateTable();
	ti.newActionWindow.visible = false;
	App.UI.Send.openWindow(ti.win);
};

exports.getWin = function() {
	return ti.win;
};
