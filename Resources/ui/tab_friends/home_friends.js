var App, friends = [], rowData = [];

var FacebookFriendList = require("ui/send/facebook_friend_list");

var cfg = {
	win : {
		backgroundColor : "white",
		title : 'friends',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
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
		row : {
			hasChild : true,
			height : 50,
			selectedBackgroundColor : "white"
		}
	},
	table : {
		top : 0,
		minRowHeight : 50,
		width : "100%",
		height : "100%",
		scrollable : false,
		filterAttribute : 'name'
	},
	search : {
		barColor : "white",
		showCancel : false,
		hintText : 'search'
	},
	labels : {
		friend : {
			font : {
				fontSize : 18
			},
			left : 70,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black",
			touchEnabled : false
		}
	},
	images : {
		friend : {
			left : 5,
			width : 40,
			height : 40,
			borderRadius : 4
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main),
		noFriends : Ti.UI.createView(cfg.views.row)
	},
	search : Ti.UI.createSearchBar(cfg.search),
	labels : {},
	table : Ti.UI.createTableView(cfg.table)
};

var friends = [];

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {

		if (e.source.addNew) {

			FacebookFriendList.open();

		} else {

			var rowFriend = App.ANDROID ? e.source.friend : e.rowData.friend;

			if (rowFriend) {
				App.UI.Send.SelectAction.open(rowFriend);
			}
		}

	});

};

var buildRow = function(friend) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.friend = friend;

	row.label = Ti.UI.createLabel(cfg.labels.friend);
	row.label.text = friend.name.toLowerCase();

	row.name = friend.name.toLowerCase();

	row.add(row.label);

	var image = Ti.UI.createImageView(cfg.images.friend);

	row.image = image;

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friend.userID + ".png");

	if (file.exists()) {
		image.image = file;
	} else {
		image.image = "/images/defaultprofile.png";
	}

	row.add(image);

	return row;
};

var buildAddNewFriendRow = function() {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	var label = Ti.UI.createLabel(cfg.labels.friend);

	row.addNew = true;
	label.text = "+ new friend";
	label.left = 10;

	row.add(label);

	return row;

};

var buildRows = function() {

	rowData = [];

	App._.each(friends, function(friend) {
		rowData.push(buildRow(friend));
	});

	rowData.push(buildAddNewFriendRow());

};

var updateTable = function() {
	friends = App.Models.Friends.all();
	friends.sort(App.Lib.Functions.sortFriends);
	buildRows();
	ti.table.setData(rowData);

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

var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	ti.tab = Ti.UI.createTab({
		window : ti.win,
		title : "friends",
		icon : "images/tab/Friends.png"
	});

	if (App.ANDROID) {

		ti.views.main.top = 50;

		ti.titleBar = App.UI.createAndroidTitleBar("Token");

		ti.titleBar.rightNavButton.title = "f";

		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.UI.Send.open(App.UI.Friends.getFriends());
		});

		ti.titleBar.rightNavButton.visible = true;

		ti.titleBar.leftNavButton.title = "Refresh";

		ti.titleBar.leftNavButton.addEventListener("click", function() {
			App.API.Transactions.syncTransactions(App.Models.User.getLastTransactionTime());
		});

		ti.titleBar.leftNavButton.visible = true;

		ti.win.add(ti.titleBar);

	} else {

		ti.win.leftNavButton = App.UI.createRefreshButton();

	}

	ti.views.getStarted = App.UI.createGetStartedRow();

	ti.views.main.add(ti.table);

	ti.views.main.add(App.UI.createSpacer());

	ti.win.add(ti.views.main);

	updateTable();

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();

	FacebookFriendList.initialize(app);

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

exports.refreshPictures = function(index) {

	App._.each(rowData, function(row) {

		if (!row.addNew) {

			var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", row.friend.userID + ".png");

			if (file.exists()) {
				row.image.image = file;
			} else {
				row.image.image = "/images/defaultprofile.png";
			}
		}

	});

};

exports.getFriends = function() {
	return friends;
};

exports.updateTable = updateTable;

exports.refresh = function() {
	updateTable();
};
