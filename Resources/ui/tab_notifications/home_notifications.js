var App;

var cfg = {
	tab : "",
	win : {
		backgroundColor : "white",
		title : "Token"
	},
	table : {
		top : 0,
		minRowHeight : 50
	},
	views : {
		row : {
			height : 50,
			layout : "horizontal"
		}
	},
	labels : {
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
		}
	},
	buttons : {}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	table : Ti.UI.createTableView(cfg.table),
	views : {},
	labels : {},
	buttons : {}
};

var test = [{
	user : "Test TEst",
	description : "Gave you two tokens"
}, {
	user : "Test TEst",
	description : "Gave you two tokens"
}, {
	user : "Test TEst",
	description : "Gave you two tokens"
}];

var buildNotificationsTable = function() {

	App._.each(test, function(notification) {
		var row = Ti.UI.createTableViewRow(cfg.views.row);

		var userLabel = Ti.UI.createLabel(cfg.labels.notificationsUser);

		userLabel.text = notification.user;

		var descLabel = Ti.UI.createLabel(cfg.labels.notificationsDesc);

		descLabel.text = notification.description;

		row.add(userLabel);
		row.add(descLabel);

		ti.table.appendRow(row);
	});
};

var refresh = function() {
	setTimeout(ti.table.afterRefresh, 1000);
}
var buildHierarchy = function() {

	ti.tab = Ti.UI.createTab({
		window : ti.win,
		title : "Notifications"
	});

	buildNotificationsTable();

	if (!App.ANDROID) {

		App.UI.addScrollToRefreshViewToTable(ti.table, refresh);

	}

	ti.win.add(ti.table);

	ti.win.rightNavButton = App.UI.createSendTokensButton();

};

var addEventListeners = function() {

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.getTab = function() {
	return ti.tab;
};
