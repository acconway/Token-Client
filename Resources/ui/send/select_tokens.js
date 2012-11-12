var App, rowData = [];

var friend, action, balance;

var TokenSlider = require("ui/widgets/token_slider");

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
		barColor : "6b8a8c",
		backgroundColor : "#DBDBDB",
		layout : "vertical"
	},
	views : {
		transaction : {
			top:15, 
			height : 50,
			width : "90%",
			borderWidth : 1,
			borderColor : "white",
			backgroundColor : "white",
			borderRadius : 2
		}
	},
	labels : {
		forLabel : {
			left : 10,
			top : 15,
			text : "For:",
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 16,
				fontWeight : "bold"
			}
		},
		actionName : {
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			color : "black",
			left : 10,
			font : {
				fontSize : 18,
				fontWeight : "light"
			}
		},
		tokens : {
			top : 15,
			left : 10,
			text : "Tokens:",
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 16,
				fontWeight : "bold"
			}
		},
	},
	buttons : {
		send : {
			top : 20,
			title : "Send",
			font : {
				fontSize : 20
			},
			backgroundImage : "none",
			borderWidth : 1,
			borderColor : "white",
			backgroundColor : "white",
			borderRadius : 2,
			width : "90%",
			height : 40,
			color : "black"
		}
	},
	images : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		forView : Ti.UI.createView(cfg.views.transaction)
	},
	labels : {
		forLabel : Ti.UI.createLabel(cfg.labels.forLabel),
		actionName : Ti.UI.createLabel(cfg.labels.actionName),
		tokens : Ti.UI.createLabel(cfg.labels.tokens)
	},
	buttons : {
		send : Ti.UI.createButton(cfg.buttons.send)
	},
	images : {}
};

var addEventListeners = function() {

	ti.buttons.send.addEventListener("click", function() {
		if (App.API.Transactions.getTransactionInProcess()) {
			return;
		}
		if (ti.slider.getValue() == 0) {
			alert("Please select a number of tokens");
			return;
		}
		var now = new Date();
		App.UI.showWait("Sending Tokens...");
		if (friend.newFriend) {
			App.UI.Friends.addFriend(friend, true);
		}
		App.API.Transactions.addTransaction(friend.userID, action.name, ti.slider.getValue(), now.getTime(), friend.name);
	});

	ti.buttons.send.addEventListener("touchstart", function() {
		ti.buttons.send.backgroundColor = "#a4b5ac";
	});
	ti.buttons.send.addEventListener("touchend", function() {
		ti.buttons.send.backgroundColor = "white";
	});

};

var buildForView = function() {

	ti.win.add(ti.labels.forLabel);

	ti.views.forView.add(ti.labels.actionName);

	ti.win.add(ti.views.forView);

};

var buildHierarchy = function() {

	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;

		ti.titleBar = App.UI.createAndroidTitleBar("Send Tokens");

		ti.win.add(ti.titleBar);

	}

	ti.views.toView = App.UI.createFriendRow("To");

	ti.win.add(ti.views.toView);

	buildForView();

	ti.win.add(ti.labels.tokens);

	ti.slider = TokenSlider.create()

	ti.win.add(ti.slider);

	ti.win.add(ti.buttons.send);

	ti.win.backButtonTitle = "Back";

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.getWin = function() {
	return ti.win;
};

exports.open = function(_friend, _action) {
	friend = _friend;
	action = _action;
	balance = App.Models.Transactions.getAllTransactionsWithFriendAndBalance(friend.userID).myBalance;
	ti.views.toView.label.text = App.Lib.Functions.getShortName(friend.name);
	ti.labels.actionName.text = action.name;
	ti.slider.update(action.lastValue == 0 ? 1 : action.lastValue, balance, action.lastValue == 0 ? false : true);

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "/profilepics", friend.userID + ".png");

	if (file.exists()) {
		ti.views.toView.profilePic.image = file;
	}else{
		ti.views.toView.profilePic.image = "/images/defaultprofile.png";
	}

	App.UI.Send.openWindow(ti.win);

	if (App.ANDROID) {
		Ti.UI.Android.hideSoftKeyboard();
	}

};
