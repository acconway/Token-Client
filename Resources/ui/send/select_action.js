var App, actions = [], rowData = [];

var friend;
var balance;

var NewAction = require("ui/widgets/new_action");

var exchange = {
	tokens : 0,
	action : null
};

var fonts = {
	black : "GoudySans Blk BT",
	bold : "GoudySans Md BT",
	book : "GoudySans LT Book",
	italic : "GoudySans LT Book Italic",
	medium : "GoudySans Md BT Medium"
};

var cfg = {
	win : {
		backgroundImage : "images/background.png",
		barColor : "#60a4b1"
	},
	views : {
		main : {
			layout : "vertical",
			top : 0,
			height : "100%",
			width : "100%",
			backgroundColor : "transparent"
		},
		row : {
			hasChild : false,
			selectedBackgroundColor : "#f3e7da",
			backgroundColor : "#f3e7da",
		},
		addNew : {
			top : 5,
			height : 30,
			backgroundImage : 'none',
			borderWidth : 1,
			borderColor : "#f3e7da",
			backgroundColor : "#f3e7da",
			borderRadius : 4,
			width : "90%"
		},
		tokens : {
			top : 15,
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			layout : "horizontal",
			backgroundColor : "transparent"
		}
	},
	table : {
		top : 5,
		minRowHeight : 35,
		width : "90%",
		height : Ti.UI.SIZE,
		borderWidth : 1,
		borderColor : "#f3e7da",
		backgroundColor : "#f3e7da",
		borderRadius : 4
	},
	labels : {
		title : {
			left : 20,
			top : 5,
			color : "faa74a",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			shadowColor : '#eee',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 17,
				fontFamily : fonts.black
			},
			text : "FOR"
		},
		action : {
			left : 10,
			color : "#6292a1",
			font : {
				fontSize : 17,
				fontFamily : fonts.medium
			},
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
		},
		addNew : {
			left : 20,
			top : 5,
			color : "faa74a",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			shadowColor : '#eee',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 17,
				fontFamily : fonts.black
			},
			text : "ADD NEW ACTION"
		},
		addNewPlus : {
			font : {
				fontSize : 24,
				fontFamily : fonts.black
			},
			color : "#9cb4b8",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			left : 10,
			text : "+"
		},
		howMany : {
			left : 20,
			top : 5,
			color : "faa74a",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			shadowColor : '#eee',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 17,
				fontFamily : fonts.black
			},
			text : "HOW MANY"
		},
		noTokens : {
			bottom : 60,
			color : "faa74a",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			shadowColor : '#eee',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 17,
				fontFamily : fonts.black
			},
			text : "NO TOKENS LEFT!"
		}
	},
	buttons : {},
	images : {
		addNew : {
			right : 10,
			width : 22,
			height : 22,
			image : "/images/icons/plus.png"
		},
		token : {
			top : 0,
			width : 33,
			height : 30
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {
		main : Ti.UI.createView(cfg.views.main),
		tokens : Ti.UI.createView(cfg.views.tokens)
	},
	labels : {
		title : Ti.UI.createLabel(cfg.labels.title),
		addNew : Ti.UI.createLabel(cfg.labels.addNew),
		addNewPlus : Ti.UI.createLabel(cfg.labels.addNewPlus),
		howMany : Ti.UI.createLabel(cfg.labels.howMany),
		noTokens : Ti.UI.createLabel(cfg.labels.noTokens)
	},
	buttons : {},
	images : {
		addNew : Ti.UI.createImageView(cfg.images.addNew)
	}
};

actions = [];

var addEventListeners = function() {

	ti.table.addEventListener("click", function(e) {
		var data = App.ANDROID ? e.source : e.rowData;
		if (data.action) {
			if (data.action == "add new") {
				ti.newActionWindow.open();
			} else {
				e.row.hasCheck = true;
				if (ti.table.lastRow && ti.table.lastRow != e.row) {
					ti.table.lastRow.hasCheck = false;
				}
				ti.table.lastRow = e.row;
				exchange.action = data.action;
			}
		}
	});

};

var addRow = function(action) {

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.action = action;

	row.label = Ti.UI.createLabel(cfg.labels.action);
	row.label.text = action.name.toLowerCase();

	row.add(row.label);

	return row;

};

var buildAddNewRow = function() {

	/*ti.views.addNew = Ti.UI.createView(cfg.views.addNew);

	 ti.views.addNew.backgroundColor = "#f3e7da";
	 ti.views.addNew.add(ti.labels.addNewPlus);

	 ti.views.addNew.addEventListener("touchstart", function() {
	 ti.views.addNew.backgroundColor = "white";
	 });

	 ti.views.addNew.addEventListener("touchend", function() {
	 ti.views.addNew.backgroundColor = "#f3e7da";
	 });*/

	var row = Ti.UI.createTableViewRow(cfg.views.row);

	row.action = "add new";

	row.label = Ti.UI.createLabel(cfg.labels.action);
	row.label.font = {
		fontSize : 16,
		fontFamily : fonts.black
	};
	row.label.text = "+ add new action";

	row.add(row.label);

	return row;

};

var buildRows = function() {

	rowData.push(buildAddNewRow());

	App._.each(actions, function(action) {
		rowData.push(addRow(action));
	});

};

var updateTable = exports.updateTable = function() {

	actions = App.Models.Transactions.getAllActions(friend.userID);
	actions = actions.concat(App.CONSTANTS.defaultActions);
	actions.sort(App.Lib.Functions.sortFriends);
	rowData = [];
	buildRows();
	ti.table.setData(rowData);

	if (rowData.length > 4) {
		ti.table.height = 162;
	} else {
		ti.table.height = Ti.UI.SIZE;
	}

	/*if (rowData.length == 0) {
	 ti.views.addNew.top = 0;
	 } else {
	 ti.views.addNew.top = 5;
	 }*/

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friend.userID + ".png");

	if (file.exists()) {
		ti.views.toView.profilePic.image = file;
	} else {
		ti.views.toView.profilePic.image = "/images/defaultprofile.png";
	}
};

var hasAction = function(name) {
	return App._.find(actions, function(action) {
		return action.name.toLowerCase() == name.toLowerCase();
	})
};

var addAction = function(name) {
	var action = {
		name : name
	};
	actions.push(action);
	var row = addRow(action);
	ti.table.appendRow(row);
	ti.table.scrollToIndex(actions.length);
	row.hasCheck = true;
	if (ti.table.lastRow) {
		ti.table.lastRow.hasCheck = false;
	}
	ti.table.lastRow = row;
	exchange.action = action;
};

var afterCreateNewAction = function(name) {
	if (hasAction(name)) {
		Ti.UI.createAlertDialog({
			title : "",
			message : "You already have an action named " + name,
		}).show();

	} else {
		addAction(name);
	}
};

var clearTokens = function() {
	exchange.tokens = 0;
	for (var j = 0; j < ti.tokens.length; j++) {
		ti.views.tokens.remove(ti.tokens[j]);
	}
};

var createTokenSelectors = function() {

	ti.tokens = [];

	for (var i = 0; i < Math.min(balance, 3); i++) {
		var token = Ti.UI.createImageView(cfg.images.token);
		var index = i;
		token.index = index;
		token.image = "images/tokensmallunselected.png";
		token.selected = false;
		token.left = i == 0 ? 0 : 20;
		ti.tokens.push(token);
		ti.views.tokens.add(token);
		token.addEventListener("click", function() {
			for (var j = 0; j < ti.tokens.length; j++) {
				if (j <= Math.min(this.index, balance - 1)) {
					ti.tokens[j].selected = true;
				} else {
					ti.tokens[j].selected = false;
				}
				exchange.tokens = this.index + 1;
				ti.tokens[j].image = ti.tokens[j].selected ? "images/tokenSmall.png" : "images/tokensmallunselected.png";
			}
		});
	};
};

var handleZeroTokens = function() {

	if (balance <= 0) {
		ti.labels.howMany.visible = false;
		ti.sendTokensSlider.visible = false;
		ti.labels.noTokens.visible = true;
	} else {
		ti.labels.howMany.visible = true;
		ti.sendTokensSlider.visible = true;
		ti.labels.noTokens.visible = false;
	}

}
var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;

		ti.titleBar = App.UI.createAndroidTitleBar("send tokens");

		ti.win.add(ti.titleBar);

		ti.views.main.top = 50;

	} else {
		ti.labels.titleControl = App.UI.getTitleControl();
		ti.labels.titleControl.text = "send tokens";
		ti.win.setTitleControl(ti.labels.titleControl);
	}

	ti.views.toView = App.UI.createFriendRow("To");

	ti.views.main.add(ti.views.toView);

	ti.views.main.add(ti.labels.title);

	ti.views.main.add(ti.table);

	ti.views.main.add(ti.labels.howMany);

	ti.win.backButtonTitle = "back";

	ti.newActionWindow = NewAction.create(afterCreateNewAction);

	ti.sendTokensSlider = App.UI.buildSendTokensSlider(true, function() {

		if (!exchange.action) {
			Ti.UI.createAlertDialog({
				title : "",
				message : "Please select an action",
			}).show();
		} else if (!exchange.tokens) {
			Ti.UI.createAlertDialog({
				title : "",
				message : "Please select how many tokens",
			}).show();
		} else {
			if (App.API.Transactions.getTransactionInProcess()) {
				return;
			}
			if (balance <= 0) {
				Ti.UI.createAlertDialog({
					title : "",
					message : "You have no tokens left!"
				}).show();
				return;
			}
			var now = new Date();
			App.UI.showWait("Sending Tokens...");
			if (friend.newFriend) {
				App.UI.Friends.addFriend(friend, true);
			}
			App.API.Transactions.addTransaction(friend.userID, exchange.action.name, exchange.tokens, now.getTime(), friend.name);
		}

	});

	createTokenSelectors();

	ti.sendTokensSlider.top = 15;

	ti.views.main.add(ti.views.tokens);

	ti.views.main.add(ti.sendTokensSlider);

	ti.win.add(ti.views.main);
	ti.win.add(ti.labels.noTokens);
	ti.win.add(ti.newActionWindow);

};

exports.initialize = function(app) {
	App = app;
	NewAction.initialize(app);

	buildHierarchy();
	addEventListeners();
};

exports.open = function(_friend) {
	friend = _friend;
	ti.views.toView.label.text = App.Lib.Functions.getShortName(friend.name.toLowerCase());
	balance = App.Models.Transactions.getAllTransactionsWithFriendAndBalance(friend.userID).myBalance;
	updateTable();
	clearTokens();
	createTokenSelectors();
	handleZeroTokens();
	ti.newActionWindow.visible = false;
	App.UI.Send.openWindow(ti.win);
};

exports.getWin = function() {
	return ti.win;
};
