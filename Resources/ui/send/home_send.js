var App;

var SelectFriend = require("ui/send/select_friend");

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
		modal : true,
		navBarHidden : true
	},
	views : {},
	labels : {},
	buttons : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {},
	labels : {},
	buttons : {}
};

var buildHierarchy = function() {

	ti.nav = Titanium.UI.iPhone.createNavigationGroup({
		window : SelectFriend.getWin()
	});

	ti.win.add(ti.nav);

};

var addEventListeners = function() {
};

exports.initialize = function(app) {

	SelectFriend.initialize(app);

	App = app;
	buildHierarchy();
	addEventListeners();

};

exports.open = function(friends) {
	SelectFriend.update(friends);
	ti.win.open();
};

exports.close = function(){
	ti.win.close(); 
}

exports.openWindow = function(window) {
	ti.nav.open(window);
}
