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
exports.User = User;

var waitOpen = false;

var cfg = {
	activityIndicator : {
		top : 20,
		width : "auto",
		color : "white"
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
		},
		waitWindow : {
			width : "100%",
			height : "100%",
			backgroundColor : "transparent"
		},
		waitBackground : {
			width : "100%",
			height : "100%",
			backgroundColor : "transparent"
		},
		waitView : {
			width : 150,
			height : 120,
			borderRadius : 10,
			backgroundColor : "black",
			layout : "vertical",
			opacity : 0.6
		},
		titleBar : {
			top : 0,
			height : 50,
			width : "100%",
			backgroundColor : "#6B8A8C",
			borderColor : "black",
			borderWidth : 1
		},
		friendRowBackground : {
			height : Ti.UI.SIZE,
			width : "100%",
			layout : "vertical",
			backgroundColor : "transparent"
		},
		friendRow : {
			top : 15,
			height : 50,
			width : "90%",
			borderWidth : 1,
			borderColor : "white",
			backgroundColor : "white",
			borderRadius : 2
		},
	},
	labels : {
		scrollToRefreshViewLabel : {
			width : 200,
			height : 30,
			bottom : 10,
			text : ""
		},
		activityIndicatorLabel : {
			color : "white",
			width : "auto",
			height : 30,
			top : 10
		},
		titleBar : {
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			font : {
				fontSize : 16,
				fontWeight : "bold"
			},
			color : "white"
		},
		friendName : {
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			color : "black",
			left : 60,
			font : {
				fontSize : 18,
				fontWeight : "light"
			}
		},
		headerTitle : {
			left : 10,
			top : 15,
			text : "To:",
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 16,
				fontWeight : "bold"
			}
		}
	},
	buttons : {
		titleBar : {
			top : 8,
			height : 40,
			width : 80,
			visible : false
		},
		sendTokens : {
			width : 25,
			height : 25,
			right : 10,
			title : "Send",
			font : {
				fontWeight : "bold",
				fontSize : 20
			}
		},
		refresh : {
			width : 25,
			height : 25,
			left : 10,
			title : "Refresh",
			font : {
				fontWeight : "bold",
				fontSize : 20
			}
		}
	},
	images : {
		profilePic : {
			left : 5,
			width : 40,
			height : 40
		}
	}
};

var ti = {
	tabGroup : Ti.UI.createTabGroup(),
	activityIndicator : Ti.UI.createActivityIndicator(cfg.activityIndicator),
	waitWindow : Ti.UI.createWindow(cfg.views.waitWindow),
	views : {
		waitView : Ti.UI.createView(cfg.views.waitView),
		waitBackground : Ti.UI.createView(cfg.views.waitBackground)
	},
	labels : {
		activityIndicatorLabel : Ti.UI.createLabel(cfg.labels.activityIndicatorLabel)
	}
};

var buildHierarchy = function() {
	App._.each(tabs, function(tab) {
		ti.tabGroup.addTab(tab.getTab());
	});
	setupActivityIndicator();
};

var addEventListeners = function() {

};

var setupActivityIndicator = function() {

	if (!App.ANDROID) {

		ti.activityIndicator.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;

		ti.waitWindow.addEventListener("click", function() {
		});

		ti.views.waitBackground.addEventListener("click", function() {
		});

		ti.views.waitView.add(ti.activityIndicator);

		ti.views.waitView.add(ti.labels.activityIndicatorLabel);

		ti.waitWindow.add(ti.views.waitBackground);

		ti.waitWindow.add(ti.views.waitView);

	}

};

exports.createSpacer = function() {
	return Ti.UI.createView({
		top : 0,
		height : App.ANDROID?60:10,
		width : "100%",
		backgroundColor : "transparent"
	});
};

exports.createFriendRow = function(title) {

	var background = Ti.UI.createView(cfg.views.friendRowBackground);

	var row = Ti.UI.createView(cfg.views.friendRow);

	if (title) {
		var header = Ti.UI.createLabel(cfg.labels.headerTitle);
		background.add(header);
	}

	var profilePic = Ti.UI.createImageView(cfg.images.profilePic);

	row.add(profilePic);

	background.profilePic = profilePic;

	var friend = Ti.UI.createLabel(cfg.labels.friendName);

	row.add(friend);

	background.label = friend;

	background.add(row);

	return background;
};

exports.createAddNewRow = function() {

};

exports.showWait = function(message) {
	if (App.ANDROID) {
		ti.activityIndicator.message = message || "Loading...";
	} else {
		ti.labels.activityIndicatorLabel.text = message || "Loading...";
	}
	if (!waitOpen) {
		if (!App.ANDROID) {
			ti.waitWindow.open();
			ti.activityIndicator.visible = true;
		} else {
			ti.activityIndicator.show();
		}
		waitOpen = true;
	}
};

exports.hideWait = function() {
	if (!App.ANDROID) {
		ti.waitWindow.close();
		ti.activityIndicator.visible = false;
	} else {
		ti.activityIndicator.hide();
	}
	waitOpen = false;
};

exports.createAndroidTitleBar = function(title) {

	var titleBar = Ti.UI.createView(cfg.views.titleBar);

	var titleBarLabel = Ti.UI.createLabel(cfg.labels.titleBar);
	titleBarLabel.text = title;
	titleBar.label = titleBarLabel;

	var rightNavButton = Ti.UI.createButton(cfg.buttons.titleBar);
	rightNavButton.right = 10;
	titleBar.rightNavButton = rightNavButton;

	var leftNavButton = Ti.UI.createButton(cfg.buttons.titleBar);
	leftNavButton.left = 10;
	titleBar.leftNavButton = leftNavButton;

	titleBar.add(leftNavButton);
	titleBar.add(titleBarLabel);
	titleBar.add(rightNavButton);

	return titleBar;

};

exports.createSendTokensButton = function() {
	var button = Ti.UI.createButton(cfg.buttons.sendTokens);

	button.addEventListener("click", function() {
		Send.open(App.UI.Friends.getFriends());
	});

	return button;
};

exports.createRefreshButton = function(){
	var button = Ti.UI.createButton(cfg.buttons.refresh);
	
	button.addEventListener('click',function(){
		App.API.Transactions.syncTransactions(App.Models.User.getLastTransactionTime());
	});
	
	return button; 
};

exports.createSendTokensActionsButton = function() {

	var button = Ti.UI.createButton(cfg.buttons.sendTokens);

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

var refreshUIOnLogin = function() {

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

	if (Ti.Facebook.loggedIn) {
		App.login();
	} else {
		Login.getWin().open();
	}

};

exports.openTabGroup = function() {
	ti.tabGroup.open();
};

exports.closeTabGroup = function() {
	ti.tabGroup.close();
}
