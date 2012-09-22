var App, friends = [], rowData = [];

var Detail = require("ui/tab_friends/detail");

exports.Detail = Detail;

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Token",
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	},
	views : {
		row : {
			backgroundColor : "white",
			hasChild : true
		}
	},
	table : {
		minRowHeight : 50
	},
	labels : {
		friend : {
			font : {
				fontSize : 16,
				fontWeight : 'light'
			},
			left : 70,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black",
			touchEnabled:false
		}
	},
	images : {
		friend : {
			left : 10,
			width : 50,
			height : 50
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table)
};

var friends = [];

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {
		
		var rowFriend = App.ANDROID?e.source.friend:e.rowData.friend;
		
		if (rowFriend) {
			Detail.open(rowFriend);
		}
		
	});

};

var addRow = function(friend) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.friend = friend;

	row.label = Ti.UI.createLabel(cfg.labels.friend);
	row.label.text = friend.name;

	row.add(row.label);

	return row;
};

var buildRows = function() {

	App._.each(friends, function(friend) {
		rowData.push(addRow(friend));
	});

};

var updateTable = function() {
	friends = App.Models.Friends.all();
	friends.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	ti.table.setData(rowData);
};

var buildHierarchy = function() {

	ti.tab = Ti.UI.createTab({
		window : ti.win,
		title : "Friends",
		icon : "images/icons/tabs/friends.png"
	});

	if (App.ANDROID) {

		ti.table.top = 50;

		ti.titleBar = App.UI.createAndroidTitleBar("Token");

		ti.titleBar.rightNavButton.title = "Send";

		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.UI.Send.open(App.UI.Friends.getFriends());
		});

		ti.titleBar.rightNavButton.visible = true;

		ti.win.add(ti.titleBar);

	} else {

		ti.table.top = 0;

		ti.win.rightNavButton = App.UI.createSendTokensButton();

	}

	ti.win.add(ti.table);

	updateTable();

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();

	Detail.initialize(app, ti.tab);

};

exports.getTab = function() {
	return ti.tab;
};

exports.addFriend = function(friend, update) {
	App.Models.Friends.addFriend(friend.name, friend.userID);
	if (update) {
		updateTable();
	}
};

exports.getFriends = function() {
	return friends;
};

exports.updateTable = updateTable;

exports.refresh = function() {
	updateTable();
};
