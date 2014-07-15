var App;

var SelectFriend = require("ui/send/select_friend");
exports.SelectFriend = SelectFriend;

var SelectAction = require("ui/send/select_action");
exports.SelectAction = SelectAction;

var cfg = {
	win : {
		backgroundColor : "white",
		title : "send tokens",
		modal : true,
		navBarHidden : true
	},
	views : {},
	labels : {},
	buttons : {}
};

var ti = {
	views : {},
	labels : {},
	buttons : {}
};

var buildHierarchy = function() {

	if (App.ANDROID) {

		ti.win = Ti.UI.createWindow(cfg.win);

	} else {

		ti.win = SelectFriend.getWin();

	}

};

var addEventListeners = function() {
};

exports.initialize = function(app) {

	SelectFriend.initialize(app);
	SelectAction.initialize(app);

	App = app;
	buildHierarchy();
	addEventListeners();

};

exports.open = function(friends) {
	SelectFriend.update(friends);
	if (App.ANDROID) {
		SelectFriend.getWin().open();
	} else {
		App.UI.getTab(0).open(ti.win);
	}
};

exports.close = function() {
	ti.win.close();
};

exports.closeWindows = function() {
	//	SelectFriend.getWin().close();
	//	SelectFriend.FacebookFriendList.getWin().close();
	//	SelectAction.getWin().close();
};

exports.openWindow = function(window) {
	if (App.ANDROID) {
		window.open();
	} else {
		App.UI.getTab(0).open(window);
	}
};
