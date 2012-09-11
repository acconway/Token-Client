var App, actions = [], rowData = [];

var friend,action; 

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
		layout : "vertical"
	},
	views : {},
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
		actionName : {
			top : 10,
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 16,
				fontWeight : "light"
			}
		},
		title : {
			top : 20,
			text : "Select amount of tokens",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE
		},
	},
	buttons : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	labels : {
		friendName : Ti.UI.createLabel(cfg.labels.friendName),
		actionName: Ti.UI.createLabel(cfg.labels.actionName),
		title : Ti.UI.createLabel(cfg.labels.title)
	},
	buttons : {}
};


var addEventListeners = function() {};

var buildHierarchy = function() {

	ti.win.add(ti.labels.friendName);
	
	ti.win.add(ti.labels.actionName);

	ti.win.add(ti.labels.title);
	
	ti.win.backButtonTitle = "Back";

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.open = function(friend,action) {
	ti.labels.friendName.text = friend.name;
	ti.labels.actionName.text = action.name; 
	App.UI.Send.openWindow(ti.win);
};
