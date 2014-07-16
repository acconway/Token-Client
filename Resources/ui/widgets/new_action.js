var ANDROID = Ti.Platform.osname == "android";

var App;

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
			borderColor : "black",
			backgroundColor : "white",
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
			color : "black",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 17
			},
			text : "ADD NEW"
		}
	},
	fields : {
		main : {
			width : "90%",
			top : 20,
			backgroundColor : "white",
			height : ANDROID ? 50 : 40,
			borderWidth : ANDROID ? 0 : 1,
			borderRadius : 4,
			color : "black",
			font : {
				fontSize : 18
			},
			borderColor : "black",
			softKeyboardOnFocus : ANDROID ? Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS : ""
		}
	},
	buttons : {
		close : {
			width : ANDROID ? 100 : 80,
			height : ANDROID ? 40 : 30,
			left : 20,
			borderRadius : 10,
			borderColor : 'black',
			backgroundImage : "null",
			backgroundColor : "white",
			color : "black",
			font : {
				fontSize : 17
			},
			title : "Close"
		},
		ok : {
			width : ANDROID ? 100 : 80,
			height : ANDROID ? 40 : 30,
			right : 20,
			borderRadius : 10,
			borderColor : 'black',
			backgroundImage : "null",
			backgroundColor : "white",
			color : "black",
			font : {
				fontSize : 17
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
