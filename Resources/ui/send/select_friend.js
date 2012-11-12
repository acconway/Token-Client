var App, friends = [], rowData = [];

var FacebookFriendList = require("ui/send/facebook_friend_list");

exports.FacebookFriendList = FacebookFriendList;

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
		barColor : "#6b8a8c",
		layout : "vertical"
	},
	views : {
		row : {
			width : "100%",
			height : 50,
			selectedBackgroundColor : "#a4b5ac",
			backgroundColor : "transparent",
			hasChild : true
		},
		addNew : {
			top : 15,
			backgroundImage : 'none',
			backgroundColor : "white",
			height : 50,
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
			font : {
				fontSize : 16,
				fontWeight : "bold"
			},
			text : "To:",
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE
		},
		friend : {
			font : {
				fontSize : 18,
				fontWeight : "light"
			},
			left : 70,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black",
			touchEnabled : false
		},
		addNewFriend : {
			font : {
				fontSize : 18,
				fontWeight : "light"
			},
			left : 10,
			height : 30,
			backgroundColor : "transparent",
			width : Ti.UI.SIZE,
			color : "black",
			text : "Add New Friend"
		}
	},
	images : {
		friend : {
			left : 5,
			width : 40,
			height : 40
		},
		addNew : {
			right : 10,
			width : 22,
			backgroundImage : "none",
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
		ti.views.addNew.backgroundColor = "white";
	});

	ti.buttons.close.addEventListener("click", function() {
		App.UI.Send.close();
	});

};

var addRow = function(friend) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.friend = friend;

	row.label = Ti.UI.createLabel(cfg.labels.friend);
	row.label.text = App.Lib.Functions.getShortName(friend.name);

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

var buildAddNew = function() {

	ti.views.addNew = Ti.UI.createView(cfg.views.addNew);

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

	App._.each(friends, function(friend) {
		rowData.push(addRow(friend));
	});

};

var updateTable = exports.updateTable = function() {
	friends.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	if (rowData.length > 5) {
		ti.table.height = 280;
	} else {
		ti.table.height = Ti.UI.SIZE;
	}
	ti.table.setData(rowData);
};

var buildHierarchy = function() {

	ti.win.backgroundColor = "#DBDBDB";

	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;

		ti.titleBar = App.UI.createAndroidTitleBar("Send Tokens");

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
			} else {
				ti.views.friend.profilePic.image = "/images/defaultprofile.png";
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
