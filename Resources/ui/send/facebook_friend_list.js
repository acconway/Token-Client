var App, friends = [], rowData = [];

//Search and side index
var indexHeader = "0", tableIndex = [], indexCounter = 0

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Friends List"//,
		//modal : true
	},
	views : {
		row : {
			backgroundColor : "white",
			className : "row"
		}
	},
	table : {
		top : 0,
		minRowHeight : 50,
		filterAttribute : 'title'
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
			touchEnabled : false,
			color : "black"
		}
	},
	images : {
		friend : {
			left : 10,
			width : 48,
			height : 48
		}
	},
	buttons : {},
	search : {
		barColor : '#385292',
		showCancel : false,
		hintText : 'search'
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	search : Ti.UI.createSearchBar(cfg.search)
};

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {
		var friend = App.ANDROID ? e.source.friend : e.rowData.friend;
		if (friend) {
			App.UI.Send.SelectAction.open({
				name : friend.name,
				userID : friend.id,
				newFriend : true
			});
		}
	});

};

var addRow = function(friend) {

	var row = Ti.UI.createTableViewRow({
		backgroundColor : "white",
		className : "row",
		title:friend.name
	});

	row.friend = friend;

	//row.sortName = friend.name;

	indexCounter++;

	if (friend.name[0].toUpperCase() != indexHeader) {
		indexHeader = friend.name[0].toUpperCase();
		tableIndex.push({
			title : indexHeader,
			index : indexCounter - 1
		});
		row.header = indexHeader;
	}

	//row.label = Ti.UI.createLabel(cfg.labels.friend);
	//row.label.text = friend.name;

	//if (!App.ANDROID) {

		//var image = Ti.UI.createImageView(cfg.images.friend);

		//row.image = image;

		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friend.id + ".png");

		if (file.exists()) {
		//	image.image = file.nativePath;
		row.leftImage = file.nativePath; 
		}
		
		row.leftImage = file.nativePath; 

		//row.add(image);

	//}

	//row.add(row.label);

	return row;

};

var buildRows = function() {

	App._.each(friends, function(friend) {
		rowData.push(addRow(friend));
	});

};

var updateTable = exports.updateTable = function() {
	ti.win.remove(ti.table);
	ti.table = Ti.UI.createTableView(cfg.table);
	ti.search = Ti.UI.createSearchBar(cfg.search);
	ti.table.search = ti.search;
	addEventListeners();
	friends = App.Models.User.getFriendsList();
	friends.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	indexCounter = 0;
	tableIndex = [];
	tableIndex.push({
		title : "{search}",
		index : 0
	});
	buildRows();
	ti.table.setData(rowData);
	ti.table.index = tableIndex;
	ti.win.add(ti.table);
};

var buildHierarchy = function() {

	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;

		ti.titleBar = App.UI.createAndroidTitleBar("Friends List");

		ti.win.add(ti.titleBar);

		cfg.table.top = 50;

	}

	ti.win.add(ti.table);

	ti.win.backButtonTitle = "Back";

	updateTable();

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.getWin = function() {
	return ti.win;
};

exports.addPicture = function(index) {

	if (rowData && rowData[index]) {

		var row = rowData[index];

		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", row.friend.id + ".png");

		if (file.exists()) {
			row.leftImage = file.nativePath;
		}

	}
};

exports.open = function() {
	App.UI.Send.openWindow(ti.win);
	App.Lib.Facebook.getPics(0, App.Models.User.getByName("friendsList"));
	App.UI.showWait("Loading Friends list...")
	updateTable();
	App.UI.hideWait();
};
