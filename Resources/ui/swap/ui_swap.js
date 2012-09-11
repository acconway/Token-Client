var App;

var currentFriend;

var PickerModule = require("/ui/swap/ui_picker");
var NewSwapModule = require("/ui/swap/ui_newswap");
var PointsModule = require("/ui/swap/ui_points")

var newSwapWin;
var pointsWin;

var myBalance;
var currentAction;

var selectedAction = false;
var makeNewSwap = false;

var levels = [{
	levelUp : 0,
	total : 6,
	caption : "Just Met"
}, {
	levelUp : 10,
	total : 6,
	caption : "Pals"
}, {
	levelUp : 10,
	total : 10,
	caption : "Buds"
}];

var cfg = {
	win : {
		backgroundColor : 'white',
		tabBarHidden : true,
		title : "Swap"
	},
	views : {
		background : {
			height : "100%",
			width : "100%",
			backgroundColor : 'black',
			opacity : 0.6,
			touchEnabled : false,
			visible : false
		},
		main : {
			height : "100%",
			width : "100%",
			backgroundColor : "white",
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
		swap : {
			height : 200,
			width : "100%",
			backgroundColor : "white",
			top : 10,
			layout : "vertical"
		},
		topRow : {
			top : 30,
			height : 60,
			width : "100%",
			backgroundColor : "white"
		},
		fromButton : {
			left : 20,
			height : 40,
			width : 100,
			backgroundColor : "white",
			borderWidth : 1
		},
		toButton : {
			right : 20,
			height : 40,
			width : 100,
			backgroundColor : 'white',
			borderWidth : 1
		},
		actionButton : {
			right : 20,
			height : 40,
			width : 100,
			backgroundColor : "white",
			borderWidth : 1
		},
		pointsButton : {
			left : 20,
			height : 40,
			width : 100,
			backgroundColor : "white",
			borderWidth : 1
		},
		bottomRow : {
			top : 40,
			height : 60,
			width : "100%",
			backgroundColor : "white"
		},
		buttons : {
			top : 30,
			width : 200,
			height : 40
		}
	},
	labels : {
		name : {
			left : 0,
			height : "100%",
			width : 100,
			enabled : false,
			textAlign : "center"
		},
		balance : {
			left : 10,
			height : 30,
			width : "auto"
		}
	},
	images : {
		arrow : {
			image : "/images/arrow.png",
			width : 30,
			height : 25
		}
	},
	buttons : {
		offer : {
			left : 10,
			width : 140,
			height : 40,
			title : "Make an offer"
		},
		send : {
			width : 140,
			height : 40,
			title : "Seal the deal"
		}
	},
	fields : {
		note : {
			hintText : "  Enter note here",
			width : "80%",
			height : 60,
			top : 30,
			borderWidth : 1,
			borderColor : "black"
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createView(cfg.views.main),
		background : Ti.UI.createView(cfg.views.background),
		balance : Ti.UI.createView(cfg.views.balance),
		balanceBar : Ti.UI.createView(cfg.views.balanceBar),
		balanceBarColor : Ti.UI.createView(cfg.views.balanceBarColor),
		balanceBarDivider : Ti.UI.createView(cfg.views.balanceBarDivider),
		swap : Ti.UI.createView(cfg.views.swap),
		topRow : Ti.UI.createView(cfg.views.topRow),
		bottomRow : Ti.UI.createView(cfg.views.bottomRow),
		fromButton : Ti.UI.createView(cfg.views.fromButton),
		toButton : Ti.UI.createView(cfg.views.toButton),
		actionButton : Ti.UI.createView(cfg.views.actionButton),
		pointsButton : Ti.UI.createView(cfg.views.pointsButton),
		buttons : Ti.UI.createView(cfg.views.buttons)
	},
	labels : {
		fromName : Ti.UI.createLabel(cfg.labels.name),
		toName : Ti.UI.createLabel(cfg.labels.name),
		action : Ti.UI.createLabel(cfg.labels.name),
		points : Ti.UI.createLabel(cfg.labels.name),
		myBalance : Ti.UI.createLabel(cfg.labels.balance),
		friendBalance : Ti.UI.createLabel(cfg.labels.balance)
	},
	images : {
		topArrow : Ti.UI.createImageView(cfg.images.arrow),
		bottomArrow : Ti.UI.createImageView(cfg.images.arrow)
	},
	pickers : {},
	buttons : {
		send : Ti.UI.createButton(cfg.buttons.send),
		offer : Ti.UI.createButton(cfg.buttons.offer)
	},
	fields : {
		note : Ti.UI.createTextField(cfg.fields.note)
	}
};

var buildSwapView = function() {

	ti.views.fromButton.add(ti.labels.fromName);
	ti.views.topRow.add(ti.views.fromButton);

	ti.images.topArrow.transform = Ti.UI.create2DMatrix().rotate(180);
	ti.views.topRow.add(ti.images.topArrow);

	ti.labels.action.text = "Action";
	ti.views.actionButton.add(ti.labels.action);
	ti.views.topRow.add(ti.views.actionButton);

	ti.views.toButton.add(ti.labels.toName);
	ti.views.bottomRow.add(ti.views.toButton);

	ti.views.bottomRow.add(ti.images.bottomArrow);

	ti.labels.points.text = "Paris";
	ti.views.pointsButton.add(ti.labels.points);
	ti.views.bottomRow.add(ti.views.pointsButton);

	ti.views.swap.add(ti.views.topRow);
	ti.views.swap.add(ti.views.bottomRow);

};

var buildBalanceView = function() {

	ti.views.balanceBar.add(ti.views.balanceBarColor);
	ti.views.balanceBar.add(ti.views.balanceBarDivider);

	ti.views.balance.add(ti.labels.myBalance);
	ti.views.balance.add(ti.views.balanceBar);
	ti.views.balance.add(ti.labels.friendBalance);

};

var buildButtonsView = function() {

	//ti.views.buttons.add(ti.buttons.offer);
	ti.views.buttons.add(ti.buttons.send);
}
var newSwapCallback = function(name) {
	ti.labels.action.text = name;
	makeNewSwap = true;
};

var pointsCallback = function(points) {
	ti.labels.points.text = points + (points > 1 ? " Paris" : " Paris");

};

var buildHierarchy = function() {

	buildBalanceView();

	buildSwapView();

	buildButtonsView();

	//	ti.views.main.add(ti.views.balance);
	ti.views.main.add(ti.views.swap);
	ti.views.main.add(ti.fields.note);
	ti.views.main.add(ti.views.buttons);

	ti.win.add(ti.views.main);

	ti.win.add(ti.views.background);

	newSwapWin = NewSwapModule.create(newSwapCallback, ti.views.background);

	ti.win.add(newSwapWin);

	pointsWin = PointsModule.create(pointsCallback, ti.views.background);

	ti.win.add(pointsWin);

};

var validateEntry = function() {

	if (ti.labels.action.text == "Action") {
		alert("Please select an action first");
		return false;
	} else if (ti.labels.points.text == "Paris") {
		alert("Please choose a number of Paris");
		return false;
	} else if(parseInt(ti.labels.points.text)>currentFriend.myBalance){
		alert("You don't have enough Paris!");
		return false;
	}else{
		return true;
	}

};

var addEventListeners = function() {

	ti.views.pointsButton.addEventListener("click", function(e) {
		if (currentAction) {
			pointsWin.open(currentAction.value, myBalance, selectedAction);
		} else {
			pointsWin.open(false, myBalance, selectedAction);
		}
		selectedAction = false;
	});

	ti.buttons.send.addEventListener("click", function(e) {
		if (validateEntry()) {
			var note = ti.fields.note.value;
			if (note == "" || note.length == 0) {
				note = null;
			}
			App.UI.Home.Friend.addGivenSwap(ti.labels.action.text, ti.labels.points.text.split(" ")[0], new Date(), note, makeNewSwap);
			ti.win.close();
		}
	});

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.getWin = function() {
	return ti.win;
};

exports.update = function(data) {

	currentFriend = data;

	ti.labels.fromName.text = App.Lib.Facebook.getUserShortName();

	ti.labels.toName.text = App.Lib.Facebook.getShortName(data.name);

	myBalance = data.myBalance;

	var totalPoints = levels[data.level - 1].total;

	var friendBalance = totalPoints - myBalance;

	ti.labels.myBalance.text = "Me: " + myBalance;
	ti.labels.friendBalance.text = "Them: " + friendBalance;

	ti.views.balanceBarColor.width = myBalance * (ti.views.balanceBar.width / totalPoints);

	if (ti.pickers.action) {
		ti.win.remove(ti.pickers.action);
	}

	ti.pickers.action = PickerModule.create(data.savedActions);

	ti.labels.action.text = "Action";
	ti.labels.points.text = "Paris";

	ti.fields.note.value = "";

	currentAction = null;
	selectedAction = false;

	newSwapWin.close();
	pointsWin.close();

	ti.pickers.action.table.addEventListener("click", function(e) {
		Ti.API.info("clicked table");
		Ti.API.info(e.index);
		if (e.index == 0) {
			currentAction = null;
			newSwapWin.open();
			ti.labels.action.text = "Action";
			ti.labels.points.text = "Paris";
			ti.pickers.action.close();
		} else {
			ti.pickers.action.close();
			ti.labels.action.text = data.savedActions[e.index - 1].name;
			ti.labels.points.text = data.savedActions[e.index - 1].value + (data.savedActions[e.index - 1].value > 1 ? " Paris" : " Paris");
			currentAction = data.savedActions[e.index - 1];
			makeNewSwap = false;
			selectedAction = true;
		}
	});

	ti.views.actionButton.addEventListener("click", ti.pickers.action.open);

	ti.win.add(ti.pickers.action);

};

exports.setToName = function(name) {
	ti.labels.toName.text = name;
};
