var App;

var _ = require('/lib/lib_underscore')._;

var FriendsList = exports.FriendsList = require("/ui/ui_friendslist");
var Friend = exports.Friend = require("/ui/ui_friend");

var friendRows = [];

var data;

var reset = false; 

var cfg = {
	win : {
		backgroundColor : "white",
		tabBarHidden : true,
		title : "Home"
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
			width : 280,
			height : 60,
			top : 10,
			left : 20,
			borderRadius : 10,
			backgroundColor : "white",
			layout : "horizontal",
			borderColor : "black"
		},
		userName : {
			top : 5,
			width : 220,
			height : 50,
			layout : 'vertical'
		},
		notifications : {
			top : 10,
			width : "100%",
			height : Ti.UI.SIZE,
			layout : 'vertical'
		},
		notificationsTable : {
			top : 10,
			width : "80%",
			height : 0,
			borderRadius : 10,
			borderColor : "black",
			backgroundColor : "white",
			layout : "vertical"
		},
		notificationsRow : {
			top : 0,
			left : 0,
			width : "100%",
			height : 50,
			backgroundColor : "white",
			layout : "vertical"
		},
		notificationsRowMain : {
			top : 0,
			left : 0,
			width : "100%",
			height : 49,
			backgroundColor : "white",
			layout : "horizontal"
		},
		friends : {
			top : 10,
			width : "100%",
			height : Ti.UI.SIZE,
			layout : 'vertical'
		},
		friendsTable : {
			top : 10,
			width : "90%",
			scrollable : false,
			borderRadius : 10,
			borderColor : "black",
			backgroundColor : "white"
		},
		friendsRow : {
			width : "100%",
			height : 50,
			backgroundColor : "white",
			layout : "horizontal"
		},
		pad : {
			top : 0,
			height : 20,
			width : "100%",
			backgroundColor : "transparent"
		}
	},
	labels : {
		userName : {
			width : "auto",
			textAlign : "center",
			height : 20,
			top : 0,
			font : {
				fontSize : 15
			},
			color : "black"
		},
		notifications : {
			width : "auto",
			height : 30,
			font : {
				fontSize : 20
			},
			color : 'black',
			text : "Notifications",
			top : 5
		},
		notificationsUser : {
			left : 10,
			width : 80,
			height : 50
		},
		notificationsDesc : {
			left : 10,
			width : "auto",
			textAlign : "left",
			height : 50
		},
		friends : {
			width : "auto",
			height : 30,
			font : {
				fontSize : 20
			},
			color : 'black',
			text : "Friends",
			top : 5
		},
		friendsName : {
			left : 10,
			width : 150,
			height : 49
		},
		friendsBalance : {
			left : 5,
			width : "auto",
			textAlign : "left",
			height : 49,
			font : {
				fontSize : 14
			}
		}
	},
	buttons : {
		logout : {
			top : 5
		},
		openFriendsList : {
			top : 20,
			width : 200,
			height : 40,
			title : "Add a new friend"
		}
	},
	images : {
		profilePic : {
			width : 50,
			height : 50,
			borderRadius : 10,
			top : 5,
			left : 10
		},
		friendPic : {
			width : 40,
			height : 40,
			left : 10,
			top : 5,
			borderRadius : 10
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createScrollView(cfg.views.main),
		user : Ti.UI.createView(cfg.views.user),
		userName : Ti.UI.createView(cfg.views.userName),
		notifications : Ti.UI.createView(cfg.views.notifications),
		notificationsTable : Ti.UI.createView(cfg.views.notificationsTable),
		friends : Ti.UI.createView(cfg.views.friends),
		friendsTable : Ti.UI.createTableView(cfg.views.friendsTable),
		pad : Ti.UI.createView(cfg.views.pad)
	},
	labels : {
		userName : Ti.UI.createLabel(cfg.labels.userName),
		notifications : Ti.UI.createLabel(cfg.labels.notifications),
		friends : Ti.UI.createLabel(cfg.labels.friends)
	},
	buttons : {
		facebook : Ti.Facebook.createLoginButton(cfg.buttons.facebook),
		openFriendsList : Ti.UI.createButton(cfg.buttons.openFriendsList)
	},
	images : {
		profilePic : Ti.UI.createImageView(cfg.images.profilePic)
	}
};

var buildUserView = function() {

	ti.views.userName.add(ti.labels.userName);
	ti.views.userName.add(ti.buttons.facebook);

	ti.views.user.add(ti.images.profilePic);
	ti.views.user.add(ti.views.userName);

};

var buildNotificationsTable = function() {

	_.each([], function(notification) {
		var row = Ti.UI.createView(cfg.views.notificationsRow);

		var main = Ti.UI.createView(cfg.views.notificationsRowMain);

		var userLabel = Ti.UI.createLabel(cfg.labels.notificationsUser);

		userLabel.text = notification.user;

		var descLabel = Ti.UI.createLabel(cfg.labels.notificationsDesc);

		descLabel.text = notificationTypes[notification.type];

		var rowLine = Ti.UI.createView(cfg.views.rowLine);

		main.add(userLabel);
		main.add(descLabel);

		row.add(main);
		row.add(rowLine);

		ti.views.notificationsTable.add(row);
		ti.views.notificationsTable.height += row.height;
	});
};

var addPic = function(file, index) {

	if (index < friendRows.length) {
		friendRows[index].picture.image = file;
	}

};

var buildNotificationsView = function() {

	buildNotificationsTable();

	ti.views.notifications.add(ti.labels.notifications);
	ti.views.notifications.add(ti.views.notificationsTable);

};

var buildFriendsTable = function() {

	friendRows = [];
	
	var counter = 0; 

	_.each(data.friends, function(friend) {

		App.Lib.Facebook.getProfilePicForID(friend.id, counter, addPic);

		var row = Ti.UI.createTableViewRow(cfg.views.friendsRow);
		
		row.id = friend.id; 

		var picture = Ti.UI.createImageView(cfg.images.friendPic);

		row.picture = picture;

		var nameLabel = Ti.UI.createLabel(cfg.labels.friendsName);

		nameLabel.text = friend.name;

		var balanceLabel = Ti.UI.createLabel(cfg.labels.friendsBalance);

		balanceLabel.text = "Level: " + friend.level;

		row.add(picture);
		row.add(nameLabel);
		row.add(balanceLabel);

		friendRows.push(row);
		
		counter++; 

	});

	ti.views.friendsTable.height = friendRows.length * cfg.views.friendsRow.height;
	ti.views.friendsTable.setData(friendRows);
};

var buildFriendsView = function() {

	buildFriendsTable();

	ti.views.friends.add(ti.labels.friends);
	ti.views.friends.add(ti.views.friendsTable);

};

var buildHierarchy = function() {

	ti.win.leftNavButton = Ti.UI.createView();

	buildUserView();

	buildNotificationsView();

	buildFriendsView();

	ti.views.main.add(ti.views.user);

	ti.views.main.add(ti.views.notifications);

	ti.views.main.add(ti.views.friends);

	ti.views.main.add(ti.buttons.openFriendsList);

	ti.views.main.add(ti.views.pad);

	ti.win.add(ti.views.main);

};

var addEventListeners = function() {

	Ti.Facebook.addEventListener('logout', function(e) {
			ti.win.close(); 
	});

	ti.buttons.openFriendsList.addEventListener("click", function() {
		FriendsList.open("home");
	});

	ti.views.friendsTable.addEventListener("click", function(e) {
		Friend.update(data.friends[e.row.id], friendRows[e.index].picture.image);
		App.UI.open(Friend);
	});

};

var update = exports.update = function() {
	ti.labels.userName.text = App.Lib.Facebook.getUserName();
	ti.images.profilePic.image = App.Lib.Facebook.getProfilePic();
};

exports.initialize = function(app) {
	
	App = app;
	
	
	data = App.Models.User.read();
	if (!data || data == {}||reset||_.keys(data).length==0) {
		Ti.API.info("Resetting data to default");
		data = App.Models.User.reset();
	}
	
	buildHierarchy();
	addEventListeners();

	FriendsList.initialize(app);
	Friend.initialize(app);
	
};

exports.getWin = function() {
	return ti.win;
};

exports.open = function() {
	update();
	App.UI.open(App.UI.Home);
}