var App;

var fonts = {
	black:"GoudySans Blk BT",
	bold:"GoudySans Md BT",
	book:"GoudySans LT Book"
};

var cfg = {
	win : {
		backgroundColor : "white",
		tabBarHidden : true,
		title : "Login",
		backgroundColor:"#DBDBDB"
	},
	views : {
		main : {
			width : "100%",
			height : "100%",
			backgroundColor : "transparent",
			backgroundImage:"/images/Default.png"
		},
		button:{
			top:280,
			height : 55,
			width : "90%",
			borderWidth : 1,
			borderColor : "#f3e7da",
			backgroundColor : "#f3e7da",
			borderRadius : 4
		}
	},
	labels : {
		title : {
			width : "auto",
			height : 50,
			text : "Token",
			font : {
				fontSize : 35,
				fontWeight : "bold"
			},
			color : "black",
			top : 75
		},
		login:{
			text:"Log in with Facebook",
			left:60,
			height:50,
			backgroundColor:"transparent",
			color:"#6292a1",
			font : {
				fontSize : 18,
				fontFamily:fonts.book 
			},
			width:Ti.UI.SIZE
		}
	},
	images:{
		facebook:{
			left : 5,
			width : 45,
			height : 45,
			image:"/images/f_logo.png"
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	views : {
		main : Ti.UI.createView(cfg.views.main),
		button:Ti.UI.createView(cfg.views.button)
	},
	labels : {
		login : Ti.UI.createLabel(cfg.labels.login)
	},
	images : {
		facebook:Ti.UI.createImageView(cfg.images.facebook)
	}
};

var buildHierarchy = function() {
	ti.win.orientationModes = [Ti.UI.PORTRAIT];

	ti.views.button.add(ti.images.facebook);
	ti.views.button.add(ti.labels.login);
	ti.views.main.add(ti.views.button);

	ti.win.add(ti.views.main);
};

var addEventListeners = function() {
	
	ti.views.button.addEventListener("click",function(){
		Ti.Facebook.authorize();
	}); 
	
	ti.views.button.addEventListener("touchstart", function() {
		ti.views.button.backgroundColor = "#e46d36";
	});
	
	ti.views.button.addEventListener("touchend", function() {
		ti.views.button.backgroundColor = "#f3e7da";
	});
};

exports.initialize = function(app) {

	App = app;
	buildHierarchy();
	addEventListeners();

};

exports.getWin = function() {
	ti.views.button.backgroundColor = "white";
	return ti.win;
};
