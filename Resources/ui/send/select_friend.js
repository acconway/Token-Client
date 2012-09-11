var App, friends = [], rowData = [];

var SelectAction = require("ui/send/select_action");

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
		layout:"vertical",
		modal : true
	},
	views : {
		row : {
			backgroundColor : "white",
			hasChild:true
		}
	},
	table : {
		top : 10,
		minRowHeight : 50,
		width:"90%",
		height:"80%",
		borderWidth : 1,
		borderColor : "black",
		borderRadius:10
	},
	labels : {
		title:{
			left:10,
			top:20,
			text:"Select a friend",
			width:Ti.UI.SIZE,
			height:Ti.UI.SIZE
		},
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
	buttons : {
		close : {
			title : "close"
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	labels:{
		title:Ti.UI.createLabel(cfg.labels.title)
	},
	buttons : {
		close : Ti.UI.createButton(cfg.buttons.close)
	}
};

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {
		if (e.rowData.friend) {
			SelectAction.open(e.rowData.friend);
		}
	});

	ti.buttons.close.addEventListener("click", function() {
		ti.win.close();
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

var updateTable = exports.updateTable = function() {
	friends.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	ti.table.setData(rowData);
};

var buildHierarchy = function() {
		
	ti.win.add(ti.labels.title);

	ti.win.add(ti.table);

	ti.win.leftNavButton = ti.buttons.close;

	updateTable();

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
	
	SelectAction.initialize(App);
};

exports.open = function(_friends) {
	friends = _friends;
	updateTable();
	ti.win.open();
};