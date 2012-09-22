var App, rowData = [];

var friend, action, balance;

var TokenSlider = require("ui/widgets/token_slider");

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
		layout : "vertical"
	},
	views : {
		transaction : {
			height : 60,
			width : 200,
			top : 10,
			borderColor : "black",
			borderWidth : 1,
			layout : "vertical"
		}
	},
	labels : {
		friendName : {
			top : 5,
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			color : "black",
			font : {
				fontSize : 18,
				fontWeight : "bold"
			}
		},
		actionName : {
			top : 5,
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			color : "black",
			font : {
				fontSize : 16,
				fontWeight : "light"
			}
		},
		title : {
			top : 40,
			text : "Select amount of tokens",
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE
		},
	},
	buttons : {
		send : {
			top : 0,
			title : "Send",
			font : {
				fontSize : 20
			},
			width : 200,
			height : 40
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		transaction : Ti.UI.createView(cfg.views.transaction)
	},
	labels : {
		friendName : Ti.UI.createLabel(cfg.labels.friendName),
		actionName : Ti.UI.createLabel(cfg.labels.actionName),
		title : Ti.UI.createLabel(cfg.labels.title)
	},
	buttons : {
		send : Ti.UI.createButton(cfg.buttons.send)
	}
};

var closeWindows = function() {
	App.UI.Send.SelectFriend.getWin().close(); 
	App.UI.Send.SelectFriend.FacebookFriendList.getWin().close(); 
	App.UI.Send.SelectAction.getWin().close();
	ti.win.close(); 
};

var addEventListeners = function() {

	ti.buttons.send.addEventListener("click", function() {

		if (ti.slider.getValue() == 0) {
			alert("Please select a number of tokens");
			return;
		}

		var now = new Date();
		if (friend.newFriend) {
			App.UI.Friends.addFriend(friend, true);
		}
		App.API.Transactions.addTransaction(friend.userID, action.name, ti.slider.getValue(), now.getTime(),friend.name);
		if (App.ANDROID) {
			closeWindows(); 
		} else {
			App.UI.Send.close();
		}
		App.UI.showWait("Sending Tokens...");
	});

};

var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;

		ti.titleBar = App.UI.createAndroidTitleBar("Send Tokens");

		ti.win.add(ti.titleBar);

	}

	ti.views.transaction.add(ti.labels.friendName);

	ti.views.transaction.add(ti.labels.actionName);

	ti.win.add(ti.views.transaction);

	ti.win.add(ti.labels.title);

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

exports.open = function(_friend, _action) {
	friend = _friend;
	action = _action;
	balance = App.Models.Transactions.getAllTransactionsWithFriendAndBalance(friend.userID).myBalance;
	ti.labels.friendName.text = friend.name;
	ti.labels.actionName.text = action.name;
	ti.slider.update(action.lastValue == 0 ? 1 : action.lastValue, balance, action.lastValue == 0 ? false : true);
	App.UI.Send.openWindow(ti.win);
};
