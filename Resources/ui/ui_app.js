var App;

var Android = Ti.Platform.name == "android";

var Login = require("ui/ui_login");
var Home = require("ui/ui_home");

var pages = {};

exports.Login = Login;
exports.Home = Home;

var cfg = {};

var ti = {
	tabGroup : Ti.UI.createTabGroup()
};

var buildHierarchy = function() {
};

var addEventListeners = function() {

};

var open = exports.open = function(page) {
	pages[page] = true;
	ti.tab.open(page.getWin());
};

var close = exports.close = function(page) {
	pages[page] = false;
	ti.tab.open(page.getWin());
};

exports.initialize = function(app) {

	App = app;
	buildHierarchy();
	addEventListeners();

	Login.initialize(app);
	Home.initialize(app);

	ti.tab = Ti.UI.createTab({
		window : Login.getWin()
	});

	ti.tabGroup.addTab(ti.tab);

	ti.tabGroup.open();

	if (Ti.Facebook.loggedIn) {
		App.Lib.Facebook.getUserData();
		Home.open();
	}
};

exports.getPages = function() {
	return pages;
}
