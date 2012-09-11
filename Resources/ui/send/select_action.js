var App, actions = [], rowData = [];

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
		layout : "vertical"
	},
	views : {
		row : {
			backgroundColor : "white",
			hasChild : true
		}
	},
	table : {
		top : 10,
		minRowHeight : 50,
		width : "90%",
		height : "70%",
		borderWidth : 1,
		borderColor : "black",
		borderRadius : 10
	},
	labels : {
		friendName : {
			top : 20,
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 18,
				fontWeight : "bold"
			}
		},
		title : {
			left : 10,
			top : 20,
			text : "Select an action",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE
		},
		action : {
			font : {
				fontSize : 16,
				fontWeight : 'light'
			},
			left : 10,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			color : "black"
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
	labels : {
		friendName : Ti.UI.createLabel(cfg.labels.friendName),
		title : Ti.UI.createLabel(cfg.labels.title)
	},
	buttons : {
		close : Ti.UI.createButton(cfg.buttons.close)
	}
};

actions = [{
	name : "Action"
}, {
	name : "Action"
}, {
	name : "Action"
}, {
	name : "Action"
}];

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {
		if (e.rowData.action) {

		} else if (e.rowData.addNew) {

		}
	});

	ti.buttons.close.addEventListener("click", function() {
		ti.win.close();
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

	var row = Ti.UI.createTableViewRow(cfg.row);
	row.label = Ti.UI.createLabel(cfg.labels.action);

	row.label.text = "Add New";
	row.label.font = {
		fontSize : 16,
		fontWeight : 'bold'
	};

	row.addNew = true;

	row.hasChild = false;

	row.add(row.label);

	rowData.push(row);

};

var buildRows = function() {

	App._.each(actions, function(action) {
		rowData.push(addRow(action));
	});

	rowData.push(buildAddNewRow());

};

var updateTable = exports.updateTable = function() {
	actions.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	ti.table.setData(rowData);
};

var buildHierarchy = function() {

	ti.win.add(ti.labels.friendName);

	ti.win.add(ti.labels.title);

	ti.win.add(ti.table);

	ti.win.leftNavButton = ti.buttons.close;

	updateTable();

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.open = function(friend) {
	ti.labels.friendName.text = friend.name;
	updateTable();
	ti.win.open();
};
