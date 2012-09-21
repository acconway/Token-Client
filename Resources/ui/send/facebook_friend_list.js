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
			backgroundColor : "white"
		}
	},
	table : {
		top : 0,
		minRowHeight : 50,
		filterAttribute : 'sortName'
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
			color : "black"
		}
	},
	images : {
		friend : {
			left : 10,
			width : 50,
			height : 50
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
		var friend = e.rowData.friend;
		if (friend) {
			App.UI.Send.SelectAction.open({
				name : friend.name,
				userID : friend.id,
				newFriend:true
			});
		}
	});

};

var addRow = function(friend) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.friend = friend;

	row.sortName = friend.name;

	indexCounter++;

	if (friend.name[0].toUpperCase() != indexHeader) {
		indexHeader = friend.name[0].toUpperCase();
		tableIndex.push({
			title : indexHeader,
			index : indexCounter - 1
		});
		row.header = indexHeader;
	}

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

var updateTable = exports.updateTable = function() {
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
};

var buildHierarchy = function() {

	ti.table.search = ti.search;

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

exports.open = function() {
	updateTable();
	App.UI.Send.openWindow(ti.win);
};
