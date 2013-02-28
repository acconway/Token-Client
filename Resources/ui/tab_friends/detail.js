var App;

var currentData;

var friend;

Ti.include("/lib/lib_date.js");

var fonts = {
	black : "GoudySans Blk BT",
	bold : "GoudySans Md BT",
	book : "GoudySans LT Book"
};

var cfg = {
	win : {
		backgroundColor : "white",
		title : '',
		backgroundImage : "images/background.png",
		barColor : "#60a4b1"
	},
	views : {
		main : {
			width : "100%",
			height : "100%",
			layout : "vertical",
			backgroundColor : "transparent",
			contentHeight : Ti.UI.SIZE,
			showVerticalScrollIndicator : true
		},
		user : {
			width : Ti.UI.SIZE,
			height : 60,
			top : 10,
			borderRadius : 10,
			backgroundColor : "white",
			layout : "horizontal",
			borderColor : "black"
		},
		padding : {
			width : 10,
			height : 60,
			left : 0
		},
		userName : {
			top : 5,
			width : Ti.UI.SIZE,
			height : 50,
			layout : 'vertical'
		},
		balanceRow : {
			top : 10,
			height : 67.5,
			width : 295,
			backgroundImage : "images/balanceBackground.png"
		},
		balanceTokenBackground : {
			left : 80,
			top : 30,
			width : 206,
			height : 25,
			backgroundImage : "images/friendTokensBackground.png"
		},
		historyTable : {
			top : 15,
			height : 0,
			scrollable : false,
			width : "90%",
			borderColor : "white",
			borderRadius : 2,
			backgroundColor : "white"
		},
		historyRow : {
			width : "100%",
			height : 70,
			touchEnabled : false
		},
		historyLabelView : {
			width : 140,
			height : 60,
			right : 0
		}
	},
	labels : {
		balanceName : {
			height : 20,
			top : 5,
			color : "#6292a1",
			font : {
				fontSize : 17,
				fontFamily : fonts.bold,
			},
			left : 85,
			width : Ti.UI.SIZE
		},
		balanceNumber : {
			height : Ti.UI.SIZE,
			top : 12,
			color : "#8a9ea2",
			font : {
				fontSize : 12,
				fontFamily : fonts.book,
			},
			right : 15,
			width : Ti.UI.SIZE
		},
		tokensTitle : {
			right : 20,
			top : 10,
			color : "faa74a",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			shadowColor : '#eee',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 16,
				fontFamily : fonts.black
			},
			text : "Tokens"
		},
		balance : {
			top : 5,
			left : 10,
			height : 30,
			color : "black",
			width : 75,
			ellipsize : true,
			font : {
				fontSize : 17,
				fontWeight : "light"
			}
		},
		activityTitle : {
			right : 20,
			top : 15,
			color : "faa74a",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			shadowColor : '#eee',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 16,
				fontFamily : fonts.black
			},
			text : "Activity"
		},
		historyDate : {
			width : Ti.UI.SIZE,
			height : 20,
			right : 10,
			top : 10,
			color : "black",
			font : {
				fontSize : 17,
				fontWeight : "light"
			}
		},
		historyTokens : {
			width : 200,
			height : 20,
			left : 10,
			top : 10,
			color : "black",
			font : {
				fontSize : 17,
				fontWeight : "light"
			}
		},
		historyAction : {
			left : 10,
			width : "90%",
			height : 25,
			top : 40,
			color : "black",
			font : {
				fontSize : 17,
				fontWeight : "light"
			}
		}
	},
	buttons : {},
	images : {
		balancePic : {
			left : 10,
			height : 50,
			width : 50,
			borderRadius:4
		},
		smallToken : {
			width : 27.5,
			height : 23.5,
			image : "images/tokenSmall.png"
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main),
		padding : Ti.UI.createView(cfg.views.padding),
		balance : Ti.UI.createView(cfg.views.balance),
		balanceBar1 : Ti.UI.createView(cfg.views.balanceBar1),
		balanceBar2 : Ti.UI.createView(cfg.views.balanceBar2),
		historyTable : Ti.UI.createTableView(cfg.views.historyTable)
	},
	labels : {
		tokensTitle : Ti.UI.createLabel(cfg.labels.tokensTitle),
		myBalance : Ti.UI.createLabel(cfg.labels.balance),
		friendBalance : Ti.UI.createLabel(cfg.labels.balance),
		activityTitle : Ti.UI.createLabel(cfg.labels.activityTitle),
	},
	buttons : {},
	images : {}
};

var addHistoryRow = function(transaction) {

	var sent = (transaction.senderID == App.Models.User.getMyID());

	var row = Ti.UI.createTableViewRow(cfg.views.historyRow);

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var tokensLabel = Ti.UI.createLabel(cfg.labels.historyTokens);
	var actionLabel = Ti.UI.createLabel(cfg.labels.historyAction);

	dateLabel.text = (new Date(parseInt(transaction.time))).customFormat("#MM#/#DD#");
	tokensLabel.text = "You " + ( sent ? "sent" : "received") + " " + transaction.tokenValue + " Token" + (transaction.tokenValue > 1 ? "s" : "");
	actionLabel.text = "For \"" + transaction.actionName + "\"";

	row.add(dateLabel);
	row.add(tokensLabel);
	row.add(actionLabel);

	row.tokensLabel = tokensLabel;
	row.actionLabel = actionLabel;

	return row;

};

var buildBalanceRow = function() {

	var balanceRow = {
		tokens : []
	};

	var main = Ti.UI.createView(cfg.views.balanceRow);

	var profilePic = Ti.UI.createImageView(cfg.images.balancePic);
	var name = Ti.UI.createLabel(cfg.labels.balanceName);
	var number = Ti.UI.createLabel(cfg.labels.balanceNumber);
	var tokenBackground = Ti.UI.createView(cfg.views.balanceTokenBackground);

	main.add(profilePic);
	main.add(name);
	main.add(number);
	main.add(tokenBackground);

	balanceRow.setFriend = function(friend) {
		profilePic.image = App.UI.getProfilePicture(friend.userID);
		name.text = friend.name;
	};

	balanceRow.setBalance = function(balance) {

		for (var i = 0; i < balanceRow.tokens.length; i++) {
			main.remove(balanceRow.tokens[i]);
		}

		balanceRow.tokens = [];

		number.text = balance;
		for (var i = 0; i < balance; i++) {
			var token = Ti.UI.createImageView(cfg.images.smallToken);
			token.left = tokenBackground.left + 5 + i * 9;
			token.top = tokenBackground.top+1;
			 main.add(token);
			balanceRow.tokens.push(token);
		}
	};

	balanceRow.main = main;

	return balanceRow;

};

var refreshTable = function() {

	ti.views.historyTable.height = 0;

	var tableData = [];

	App._.each(currentData.transactions, function(transaction) {
		tableData.push(addHistoryRow(transaction));
		ti.views.historyTable.height += (cfg.views.historyRow.height + (App.ANDROID ? 1 : 0));
	});

	ti.views.historyTable.setData(tableData);

};

var refreshBalance = function() {

	var myBalance = currentData.myBalance;

	var friendBalance = App.CONSTANTS.TOTALPOINTS - myBalance;

	ti.friendBalance.setBalance(friendBalance);

};

var update = function(_friend) {

	friend = _friend;

	currentData = App.Models.Transactions.getAllTransactionsWithFriendAndBalance(friend.userID);

	ti.labels.titleControl.text = friend.name;

	ti.friendBalance.setFriend(friend);

	refreshBalance();

	refreshTable();

};

exports.open = function(_friend) {
	friend = _friend;
	update(friend);
	ti.tab.open(ti.win);
};

var buildHierarchy = function() {

	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	if (App.ANDROID) {

		ti.win.navBarHidden = true;
		ti.views.main.top = 50;

		ti.titleBar = App.UI.createAndroidTitleBar();

		cfg.views.historyRow.backgroundSelectedColor = 'white';

		ti.titleBar.rightNavButton.title = "Send";
		ti.titleBar.rightNavButton.addEventListener("click", function() {
			App.UI.Send.SelectAction.open(friend);
		});
		ti.titleBar.rightNavButton.visible = true;

		ti.win.add(ti.titleBar);

	} else {

		cfg.views.historyRow.selectedBackgroundColor = 'white';
		ti.win.backButtonTitle = "Back";

		/*	var button = App.UI.createSendTokensActionsButton();

		 button.addEventListener("click", function() {
		 App.UI.Send.open(App.UI.Friends.getFriends());
		 App.UI.Send.SelectAction.open(friend);
		 });

		 ti.win.rightNavButton = button;*/

		ti.labels.titleControl = App.UI.getTitleControl();

		ti.win.setTitleControl(ti.labels.titleControl);

	}

	ti.friendBalance = buildBalanceRow();

	ti.views.main.add(ti.labels.tokensTitle);
	ti.views.main.add(ti.friendBalance.main);
	ti.views.main.add(ti.labels.activityTitle);
	ti.views.main.add(ti.views.historyTable);
	ti.views.main.add(App.UI.createSpacer());
	ti.win.add(ti.views.main);

};

var addEventListeners = function() {
};

exports.update = function() {
	if (friend) {
		update(friend);
	}
};

exports.initialize = function(app, tab) {
	App = app;
	ti.tab = tab;
	buildHierarchy();
	addEventListeners();
};
