var App, friends = [], rowData = [];

var FacebookFriendList = require("ui/send/facebook_friend_list");

exports.FacebookFriendList = FacebookFriendList;

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
		title : 'send',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT],
		layout : "vertical"
	},
	views : {
		row : {
			width : "100%",
			height : 50,
			selectedBackgroundColor : "white",
			backgroundColor : "white",
			hasChild : true
		},
		addNew : {
			top : 5,
			backgroundImage : 'none',
			borderWidth : 1,
			borderColor : "black",
			backgroundColor : "white",
			borderRadius : 4,
			height : 50,
			width : "90%"
		}
	},
	table : {
		top : 5,
		minRowHeight : 50,
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
			text : "To"
		},
		friend : {
			font : {
				fontSize : 18,
			},
			left : 70,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black",
			touchEnabled : false
		},
		addNewFriend : {
			left : 20,
			top : 5,
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 17,
			},
			text : "Add new friend"
		},
		addNewPlus : {
			font : {
				fontSize : 24
			},
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			left : 10,
			text : "+"
		}
	},
	images : {
		friend : {
			left : 5,
			width : 40,
			height : 40,
			borderRadius : 4
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
		addNew : Ti.UI.createLabel(cfg.labels.addNewFriend),
		addNewPlus : Ti.UI.createLabel(cfg.labels.addNewPlus)
	},
	images : {},
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
	row.label.text = App.Lib.Functions.getShortName(friend.name.toLowerCase());

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

	ti.views.addNew.add(ti.labels.addNewPlus);

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

	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;

		ti.titleBar = App.UI.createAndroidTitleBar("send");

		ti.win.add(ti.titleBar);

	} 

	ti.win.add(ti.labels.title);

	ti.win.add(ti.table);

	buildAddNew();

	ti.win.add(ti.labels.addNew);

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
