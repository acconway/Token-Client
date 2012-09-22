var App;

var cfg = {
	tab : "",
	win : {
		backgroundColor : "white",
		title : "Token"
	},
	views : {},
	labels : {},
	buttons : {
		logout : {
			title : "logout",
			height : 30,
			width : 200
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {},
	labels : {},
	buttons : {
		logout:Ti.UI.createButton(cfg.buttons.logout)
	}
};

var buildHierarchy = function() {

	ti.tab = Ti.UI.createTab({
		window : ti.win,
		title : "User",
		icon:"images/icons/tabs/user.png"
	});

	ti.win.rightNavButton = ti.buttons.logout; 
	
	

};

var addEventListeners = function() {
	ti.buttons.logout.addEventListener("click",function(){
		App.logout(); 
	});
};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.getTab = function() {
	return ti.tab;
};
