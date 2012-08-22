var App;

var currentData;

var _ = require('/lib/lib_underscore')._;

Ti.include("/lib/lib_date.js");

var levels = [{
	levelUp : 0,
	total : 10,
	caption : "Just Met"
}, {
	levelUp : 10,
	total : 10,
	caption : "Pals"
}, {
	levelUp : 10,
	total : 10,
	caption : "Buds"
}];

var Swap = require("/ui/ui_swap");

var cfg = {
	win : {
		backgroundColor : "white",
		tabBarHidden : true,
		title : "Friendship"
	},
	views : {
		main : {
			width : "100%",
			height : "100%",
			layout : "vertical",
			backgroundColor : "transparent",
			contentHeight : "auto",
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
		balance : {
			top : 10,
			width : Ti.UI.SIZE,
			height : 30,
			backgroundColor : "white",
			layout : 'horizontal'
		},
		balanceBar : {
			height : 30,
			left : 10,
			borderColor : "black",
			borderWidth : 1,
			width : 120,
			backgroundColor : "white",
			layout : "horizontal"
		},
		balanceBarColor : {
			height : 30,
			width : 0,
			backgroundColor : "red",
			left : 0
		},
		balanceBarDivider : {
			height : 30,
			width : 1,
			backgroundColor : "black",
			left : 0
		},
		historyTable : {
			top : 10,
			height : 0,
			width : "90%",
			scrollable : false,
			borderRadius : 10,
			borderColor : "black",
			backgroundColor : "white"
		},
		historyRow : {
			width : "100%",
			height : 50,
			backgroundColor : "white"
		}
	},
	labels : {
		userName : {
			width : "auto",
			textAlign : "center",
			height : 60,
			font : {
				fontSize : 20
			},
			left : 10,
			color : "black"
		},
		balance : {
			left : 10,
			height : 30,
			width : 70
		},
		historyDate : {
			width : 80,
			height : 50,
			left : 10,
			font : {
				fontSize : 14
			}
		},
		historyName : {
			width : "auto",
			height : 50,
			left : 100,
			font : {
				fontSize : 14
			}
		},
		historyValue : {
			width : "auto",
			height : 50,
			right : 15,
			font : {
				fontSize : 14
			}
		}
	},
	buttons : {
		trade : {
			top : 10,
			title : "Send Paris",
			width : 150,
			height : 30
		}
	},
	images : {
		profilePic : {
			width : 50,
			height : 50,
			borderRadius : 10,
			top : 5,
			left : 10
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main),
		user : Ti.UI.createView(cfg.views.user),
		padding : Ti.UI.createView(cfg.views.padding),
		balance : Ti.UI.createView(cfg.views.balance),
		balanceBar : Ti.UI.createView(cfg.views.balanceBar),
		balanceBarColor : Ti.UI.createView(cfg.views.balanceBarColor),
		balanceBarDivider : Ti.UI.createView(cfg.views.balanceBarDivider),
		historyTable : Ti.UI.createTableView(cfg.views.historyTable)
	},
	labels : {
		userName : Ti.UI.createLabel(cfg.labels.userName),
		myBalance : Ti.UI.createLabel(cfg.labels.balance),
		friendBalance : Ti.UI.createLabel(cfg.labels.balance)
	},
	buttons : {
		trade : Ti.UI.createButton(cfg.buttons.trade)
	},
	images : {
		profilePic : Ti.UI.createImageView(cfg.images.profilePic)
	}
};

var buildUserView = function() {

	ti.views.user.add(ti.images.profilePic);
	ti.views.user.add(ti.labels.userName);
	ti.views.user.add(ti.views.padding);

};

var buildBalanceView = function() {

	ti.views.balanceBar.add(ti.views.balanceBarColor);
	ti.views.balanceBar.add(ti.views.balanceBarDivider);
	
	ti.labels.myBalance.textAlign = "right";
	ti.labels.myBalance.width  = 55;

	ti.views.balance.add(ti.labels.myBalance);
	ti.views.balance.add(ti.views.balanceBar);
	ti.views.balance.add(ti.labels.friendBalance);

};

var buildHierarchy = function() {
	buildUserView();
	buildBalanceView();
	ti.views.main.add(ti.views.user);
	ti.views.main.add(ti.views.balance);
	ti.views.main.add(ti.buttons.trade);
	ti.views.main.add(ti.views.historyTable);
	ti.win.add(ti.views.main);
};

var addEventListeners = function() {
	ti.buttons.trade.addEventListener("click", function() {
		Swap.update(currentData);
		App.UI.open(Swap);
	});
};

var refreshBalance = function() {

	var myBalance = currentData.myBalance;

	var totalPoints = levels[currentData.level - 1].total;

	var friendBalance = totalPoints - myBalance;

	ti.labels.myBalance.text = "Me: " + myBalance;
	ti.labels.friendBalance.text = "Them: " + friendBalance;

	ti.views.balanceBarColor.width = myBalance * (ti.views.balanceBar.width / totalPoints);

};

var refreshTable = function() {

	var tableData = [];
	
	ti.views.historyTable.height = 0; 
		
	_.each(currentData.transactionHistory, function(transaction) {
		tableData.push(addHistoryRow(transaction.action, transaction.value, new Date(transaction.date), transaction.note, transaction.givenToMe));
	});
	
	ti.views.historyTable.setData(tableData);

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();

	Swap.initialize(app);
};

exports.getWin = function() {
	return ti.win;
}
var addSavedAction = function(name, value) {

	currentData.savedActions.push({
		name : name,
		value : value
	});

	App.Models.User.setByName(currentData.id, currentData);

	App.Models.User.save();
};

var addAction = function(name, value, date, note, given) {

	currentData.transactionHistory.push({
		action : name,
		value : value,
		date : date.getTime(),
		note : note,
		givenToMe : given
	});

	if (given) {
		currentData.myBalance += value;
	} else {
		currentData.myBalance -= value;
	}

	refreshBalance();

	App.Models.User.setByName(currentData.id, currentData);

	App.Models.User.save();

};

var addHistoryRow = function(name, value, date, note) {

	var row = Ti.UI.createTableViewRow(cfg.views.historyRow);

	var dateLabel = Ti.UI.createLabel(cfg.labels.historyDate);
	var nameLabel = Ti.UI.createLabel(cfg.labels.historyName);
	var valueLabel = Ti.UI.createLabel(cfg.labels.historyValue);

	dateLabel.text = date.customFormat("#MM#/#DD#/#YYYY#");
	nameLabel.text = name;
	valueLabel.text = value;

	row.add(dateLabel);
	row.add(nameLabel);
	row.add(valueLabel);

	ti.views.historyTable.height += row.height;

	return row;

};

exports.addGivenSwap = function(name, value, date, note, newSwap) {

	if (newSwap) {
		addSavedAction(name, value);
	}

	addAction(name, value, date, note, false);

	refreshTable(); 
	
};

exports.update = function(data, picture) {

	currentData = data;

	ti.labels.userName.text = data.name;
	ti.images.profilePic.image = picture;

	refreshBalance();

	refreshTable();

};
