var ANDROID = Ti.Platform.osname == "android";

var App;

var fonts = {
	black : "GoudySans Blk BT",
	bold : "GoudySans Md BT",
	book : "GoudySans LT Book",
	italic : "GoudySans LT Book Italic",
	medium : "GoudySans Md BT Medium"
};


var cfg = {
	window : {
		height : "100%",
		width : "100%",
		visible : false,
		contentHeight : Ti.UI.SIZE,
		
		backgroundColor : "transparent"
	},
	views : {
		cover : {
			height : "100%",
			width : "100%",
			backgroundColor : "black",
			opacity : 0.6
		},
		main : {
			top : "5%",
			width : "90%",
			height : 160,
			backgroundImage : "images/background.png",
			borderColor : "#f5efe9",
			borderWidth : 1,
			borderRadius : 4,
			layout : "vertical"
		},
		buttons : {
			top : 10,
			height : ANDROID ? 50 : 30,
			width : "90%"
		}
	},
	labels : {
		main : {
			top : 20,
			color : "faa74a",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			shadowColor : '#eee',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 17,
				fontFamily : fonts.black
			},
			text : "ADD NEW ACTION"
		}
	},
	fields : {
		main : {
			width : "90%",
			top : 20,
			backgroundColor : "#f3e7da",
			height : ANDROID ? 50 : 40,
			borderWidth : ANDROID ? 0 : 1,
			borderRadius:4, 
			color : "#6292a1",
			font : {
				fontSize : 18,
				fontFamily : fonts.medium
			},
			borderColor : "#f3e7da",
			softKeyboardOnFocus : ANDROID ? Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS : ""
		}
	},
	buttons : {
		close : {
			width : ANDROID ? 100 : 80,
			height : ANDROID ? 40 : 30,
			left : 20,
			borderRadius : 10,
			borderColor : '#f3e7da',
			backgroundImage:"null",
			backgroundColor : "#f3e7da",
			color : "#6292a1",
			font : {
				fontSize : 17,
				fontFamily : fonts.medium
			},
			title : "Close"
		},
		ok : {
			width : ANDROID ? 100 : 80,
			height : ANDROID ? 40 : 30,
			right : 20,
			borderRadius : 10,
			borderColor : '#f3e7da',
			backgroundImage:"null",
			backgroundColor : "#f3e7da",
			color : "#6292a1",
			font : {
				fontSize : 17,
				fontFamily : fonts.medium
			},
			title : "OK"
		}
	}
};

exports.create = function(callback) {

	var ti = {
		window : Ti.UI.createView(cfg.window),
		views : {
			cover : Ti.UI.createView(cfg.views.cover),
			main : Ti.UI.createView(cfg.views.main),
			buttons : Ti.UI.createView(cfg.views.buttons)
		},
		labels : {
			main : Ti.UI.createLabel(cfg.labels.main)
		},
		fields : {
			main : Ti.UI.createTextField(cfg.fields.main)
		},
		buttons : {
			close : Ti.UI.createButton(cfg.buttons.close),
			ok : Ti.UI.createButton(cfg.buttons.ok)
		}
	};

	ti.buttons.close.addEventListener("click", function() {
		ti.window.visible = false;
		ti.fields.main.blur();
	});

	ti.buttons.ok.addEventListener("click", function() {
		if (App.Lib.Functions.removeWhitespace(ti.fields.main.value) != "" && ti.fields.main.value.length <= 28) {
			callback(ti.fields.main.value);
			ti.fields.main.blur();
			ti.window.visible = false;
		} else {
			if (ti.fields.main.value.length > 28) {
				Ti.UI.createAlertDialog({
					title : "",
					message : "Maximum length is 28 characters. You entered " + ti.fields.main.value.length,
				}).show();
			} else {
				Ti.UI.createAlertDialog({
					title : "",
					message : "Please enter a name",
				}).show();
			}
		}
	});

	ti.views.buttons.add(ti.buttons.close);
	ti.views.buttons.add(ti.buttons.ok);

	ti.views.main.add(ti.labels.main);
	ti.views.main.add(ti.fields.main);
	ti.views.main.add(ti.views.buttons);

	ti.window.add(ti.views.cover);
	ti.window.add(ti.views.main);

	if (App.ANDROID) {
		ti.views.main.height = 200;
	}

	ti.window.open = function() {

		ti.fields.main.value = "";

		ti.window.visible = true;

		ti.fields.main.focus();

	};

	return ti.window;

};

exports.initialize = function(app) {
	App = app;
};
