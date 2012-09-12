var App;

/*
 * Login Window: this is outside of the main tabgroup. Opened on launch if the user is not logged in.
 * If the user logs out, the main tabgroup is closed and the Login Window is re-opened.
 */

var Login = require("ui/ui_login");

/*
 * Main tabs: Friends, Notifications, User.
 */

var Friends = require("ui/tab_friends/home_friends");
var Notifications = require("ui/tab_notifications/home_notifications");
var User = require("ui/tab_user/home_user");

var tabs = [Friends, Notifications, User];

/*
 * Send Tokens Starting Window (Select Friend)
 */

var Send = require("ui/send/home_send");

/*
 * Declare exports of App.UI namespace
 */

exports.Login = Login;
exports.Friends = Friends;
exports.Notifications = Notifications;
exports.Send = Send;

var cfg = {
	buttons : {
		sendTokens : {
			width : 25,
			height : 25,
			right : 10,
			title : "Send",
			font : {
				fontWeight : "bold",
				fontSize : 20
			}
		}
	},
	views : {
		scrollToRefreshView : {
			backgroundColor : "white",
			width : "100%",
			height : 60
		},
		scrollToRefreshViewBorder : {
			backgroundColor : "black",
			height : 2,
			bottom : 0
		}
	},
	labels : {
		scrollToRefreshViewLabel : {
			width : 200,
			height : 30,
			bottom : 10,
			text : ""
		}
	}
};

var ti = {
	tabGroup : Ti.UI.createTabGroup()
};

var buildHierarchy = function() {
	App._.each(tabs, function(tab) {
		ti.tabGroup.addTab(tab.getTab());
	});
};

var addEventListeners = function() {

};

exports.createSendTokensButton = function() {
	var button = Ti.UI.createButton(cfg.buttons.sendTokens);

	button.addEventListener("click", function() {
		Send.open(App.UI.Friends.getFriends()); 
	});

	return button;
};

exports.addScrollToRefreshViewToTable = function(tableView, callback) {

	tableView.toRefresh = false;
	tableView.reloading = false;

	var view = Ti.UI.createView(cfg.views.scrollToRefreshView);
	var viewBorder = Ti.UI.createView(cfg.views.scrollToRefreshViewBorder);
	var label = Ti.UI.createLabel(cfg.labels.scrollToRefreshViewLabel);

	view.add(label);
	view.add(viewBorder);

	tableView.headerPullView = view;
	tableView.refreshLabel = label;

	tableView.afterRefresh = function() {
		tableView.setContentInsets({
			top : 0
		}, {
			animated : true
		});
		tableView.reloading = false;
		//label.text = "Pull down to refresh...";
	};

	tableView.addEventListener('scroll', function(e) {
		if (tableView.reloading) {
			return;
		}
		var offset = e.contentOffset.y;
		if (offset <= -65.0) {
			tableView.toRefresh = true;
			label.text = "Release to refresh...";
		} else if (offset > -65.0 && offset < 0) {
			tableView.toRefresh = false;
			label.text = "Pull down to refresh...";
		}
	});

	tableView.addEventListener('dragEnd', function(e) {
		if (!tableView.reloading && tableView.toRefresh) {
			tableView.toRefresh = false;
			tableView.reloading = true;
			label.text = "Reloading...";
			tableView.setContentInsets({
				top : 60
			}, {
				animated : true
			});
			callback();
		}
	});

};

var refreshUIOnLogin = function(){
	
};

exports.initialize = function(app) {

	//Set App namespace reference

	App = app;

	//Initialize Login

	Login.initialize(app);

	//Initialize tabs home pages

	App._.each(tabs, function(tab) {
		tab.initialize(app);
	});
	
	//Initialize Send
	
	Send.initialize(app);

	buildHierarchy();
	addEventListeners();
	
	if(Ti.Facebook.loggedIn){
		App.login(); 
	}else{
		Login.getWin().open(); 
	}

};

exports.openTabGroup = function(){
	ti.tabGroup.open(); 
}

exports.closeTabGroup = function(){
	ti.tabGroup.close();
}
