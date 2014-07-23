var App;

var cfg = {
	win : {
		backgroundColor : "white",
		tabBarHidden : true,
		title : "Login",
	},
	views : {
		main : {
			width : "100%",
			height : "100%",
			backgroundColor : "white",
		},
		button : {
			top : 280,
			height : 55,
			width : "90%",
			borderWidth : 1,
			borderColor : "black",
			backgroundColor : "white"
		}
	},
	labels : {
		title : {
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			text : "Oblique",
			font : {
				fontSize : 20
			},
			color : "black",
			top : 75
		},
		login : {
			text : "Log in with Facebook",
			left : 60,
			height : 50,
			backgroundColor : "transparent",
			color : "black",
			font : {
				fontSize : 17
			},
			width : Ti.UI.SIZE
		}
	},
	images : {
		facebook : {
			left : 5,
			width : 45,
			height : 45,
			image : "/images/f_logo.png"
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createView(cfg.views.main),
		button : Ti.UI.createView(cfg.views.button)
	},
	labels : {
		title : Ti.UI.createLabel(cfg.labels.title),
		login : Ti.UI.createLabel(cfg.labels.login)
	},
	images : {
		facebook : Ti.UI.createImageView(cfg.images.facebook)
	}
};

var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	ti.views.button.add(ti.images.facebook);
	ti.views.button.add(ti.labels.login);

	ti.views.main.add(ti.labels.title);
	ti.views.main.add(ti.views.button);

	ti.win.add(ti.views.main);
};

var addEventListeners = function() {

	ti.views.button.addEventListener("click", function() {
		App.Lib.Facebook.authorize();
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
