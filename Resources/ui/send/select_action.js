var App, actions = [], rowData = [];

var friend; 

var SelectTokens = require("ui/send/select_tokens");

var NewAction = require("ui/widgets/new_action");

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
	},
	views : {
		main:{
			layout:"vertical",
			top:0,
			height:"100%",
			width:"100%",
			backgroundColor:"transparent"
		},
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
	buttons : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views:{
		main:Ti.UI.createView(cfg.views.main)
	},
	labels : {
		friendName : Ti.UI.createLabel(cfg.labels.friendName),
		title : Ti.UI.createLabel(cfg.labels.title)
	},
	buttons : {}
};

actions = [];

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {
		if (e.rowData.action) {
			SelectTokens.open(friend,e.rowData.action);
		} else if (e.rowData.addNew) {
			ti.newActionWindow.open();
		}
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
	actions = App.Models.Transactions.getAllActions(); 
	actions.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	ti.table.setData(rowData);
};

var afterCreateNewAction = function(name){
	SelectTokens.open(friend,{name:name});
};

var buildHierarchy = function() {
	
	ti.views.main.add(ti.labels.friendName);

	ti.views.main.add(ti.labels.title);

	ti.views.main.add(ti.table);
	
	ti.win.backButtonTitle = "Back";

	updateTable();
	
	ti.newActionWindow = NewAction.create(afterCreateNewAction);
	
	ti.win.add(ti.views.main);
	ti.win.add(ti.newActionWindow);

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
	
	SelectTokens.initialize(App);
};

exports.open = function(_friend) {
	friend = _friend; 
	ti.labels.friendName.text = friend.name;
	updateTable();
	ti.newActionWindow.visible = false; 
	App.UI.Send.openWindow(ti.win);
};
