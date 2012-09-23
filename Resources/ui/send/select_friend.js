var App, friends = [], rowData = [];

var FacebookFriendList = require("ui/send/facebook_friend_list");

exports.FacebookFriendList = FacebookFriendList;

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
		layout : "vertical"
	},
	views : {
		row : {
			width : "100%",
			height : 50,
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
		height : 280,
		borderWidth : 1,
		borderColor : "black",
		backgroundColor : "white",
		borderRadius : 10
	},
	labels : {
		title : {
			left : 10,
			top : 10,
			text : "Select a friend",
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE
		},
		friend : {
			font : {
				fontSize : 16,
				fontWeight : 'light'
			},
			left : 70,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black",
			touchEnabled : false
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
			text : "Add New Friend"
		}
	},
	images : {
		friend : {
			left : 10,
			width : 50,
			height : 50
		},
		addNew : {
			right : 10,
			width : 22,
			height : 22,
			image : "/images/icons/plus.png"
		}
	},
	buttons : {
		close : {
			title : "close"
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {},
	labels : {
		title : Ti.UI.createLabel(cfg.labels.title),
		addNew : Ti.UI.createLabel(cfg.labels.addNewFriend)
	},
	images : {
		addNew : Ti.UI.createImageView(cfg.images.addNew)
	},
	buttons : {
		close : Ti.UI.createButton(cfg.buttons.close)
	}
};

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {
		var rowFriend = App.ANDROID ? e.source.friend : e.rowData.friend;
		if (rowFriend) {
			App.UI.Send.SelectAction.open(rowFriend);
		}
	});

	ti.views.addNew.addEventListener("click", function(e) {
		FacebookFriendList.open();
	});

	ti.buttons.close.addEventListener("click", function() {
		App.UI.Send.close();
	});

};

var addRow = function(friend) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.friend = friend;

	row.label = Ti.UI.createLabel(cfg.labels.friend);
	row.label.text = friend.name;

	row.add(row.label);

	var image = Ti.UI.createImageView(cfg.images.friend);

	row.image = image;

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friend.userID + ".png");

	if (file.exists()) {
		image.image = file;
	}

	row.add(image);

	return row;

};

var buildAddNew = function() {

	ti.views.addNew = App.ANDROID ? Ti.UI.createView(cfg.views.addNew) : Ti.UI.createButton(cfg.views.addNew);

	ti.views.addNew.add(ti.labels.addNew);
	ti.views.addNew.add(ti.images.addNew);

};

var buildRows = function() {

	App._.each(friends, function(friend) {
		rowData.push(addRow(friend));
	});

};

var updateTable = exports.updateTable = function() {
	friends.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	ti.table.setData(rowData);
};

var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;

		ti.titleBar = App.UI.createAndroidTitleBar("Select Friend");

		ti.win.add(ti.titleBar);

	}

	ti.win.add(ti.labels.title);

	ti.win.add(ti.table);

	buildAddNew();

	ti.win.add(ti.views.addNew);

	ti.win.leftNavButton = ti.buttons.close;

	updateTable();

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();

	FacebookFriendList.initialize(app);

};

exports.refreshPictures = function(index) {

	App._.each(rowData, function(row) {

		if (!row.image.image) {
			var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", row.friend.userID + ".png");

			if (file.exists()) {
				row.image.image = file;
			}
		}
	});

};

exports.update = function(_friends) {
	friends = _friends;
	updateTable();
};

exports.getWin = function() {
	return ti.win;
};
