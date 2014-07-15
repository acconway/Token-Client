var App, friends = [], rowData = [];

var Detail = require("ui/tab_friends/detail");

exports.Detail = Detail;

var fonts = {
	black : "GoudySans Blk BT",
	bold : "GoudySans Md BT",
	book : "GoudySans LT Book",
	italic : "GoudySans LT Book Italic",
	medium : "GoudySans Md BT Medium"
};

var cfg = {
	win : {
		backgroundColor : "white",
		title : '',
		backgroundImage : "images/background.png",
		barColor : "#60a4b1",
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
			hasChild : false,
			height : 50,
			selectedBackgroundColor : "white"
		}
	},
	table : {
		top : 15,
		minRowHeight : 50,
		width : "90%",
		scrollable : false,
		height : 0,
		filterAttribute : 'name',
		borderWidth : 1,
		borderColor : "#f3e7da",
		backgroundColor : "#f3e7da",
		borderRadius : 4
	},
	search : {
		barColor : "#f7ece0",
		showCancel : false,
		hintText : 'search'
	},
	labels : {
		friend : {
			font : {
				fontSize : 18,
				fontFamily : fonts.bold
			},
			left : 70,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "#6292a1",
			touchEnabled : false
		}
	},
	images : {
		friend : {
			left : 5,
			width : 40,
			height : 40,
			borderRadius : 4
		},
		arrow : {
			image : "images/tablearrow.png",
			height : 7,
			width : 7,
			right : 10
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

		var rowFriend = App.ANDROID ? e.source.friend : e.rowData.friend;

		if (rowFriend) {
			Detail.open(rowFriend);
		}

	});

};

var addRow = function(friend) {

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

	var arrow = Ti.UI.createImageView(cfg.images.arrow);

	row.add(arrow);

	return row;
};

var buildRows = function() {

	App._.each(friends, function(friend) {
		rowData.push(addRow(friend));
		ti.table.height += (cfg.views.row.height + (App.ANDROID ? 1 : 0));
	});

};

var updateTable = function() {
	friends = App.Models.Friends.all();
	friends.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	ti.table.height = 0;
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

		ti.titleBar.rightNavButton.title = "Send";

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

		ti.table.top = 15;

		ti.labels.titleControl = App.UI.getTitleControl();
		ti.labels.titleControl.text = "friends";
		ti.win.setTitleControl(ti.labels.titleControl);

		ti.win.rightNavButton = App.UI.createSendTokensButton();
		ti.win.leftNavButton = App.UI.createRefreshButton();

	}

	ti.views.getStarted = App.UI.createGetStartedRow();

	//ti.table.search = ti.search;

	ti.views.main.add(ti.table);

	ti.views.main.add(App.UI.createSpacer());

	ti.win.add(ti.views.main);

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

exports.refreshPictures = function(index) {

	App._.each(rowData, function(row) {

		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", row.friend.userID + ".png");

		if (file.exists()) {
			row.image.image = file;
		} else {
			row.image.image = "/images/defaultprofile.png";
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
