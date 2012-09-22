var ANDROID = Ti.Platform.osname == "android";

var cfg = {
	window : {
		height : "100%",
		width : "100%",
		visible:false,
		contentHeight:Ti.UI.SIZE,
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
			top:"25%",
			width : "80%",
			height : 160,
			backgroundColor : "white",
			borderColor : "black",
			borderWidth : 2,
			borderRadius : 5,
			layout : "vertical"
		},
		buttons : {
			top : 20,
			height : 30,
			width : "90%"
		}
	},
	labels : {
		main : {
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			text : "Add new action",
			top : 20
		}
	},
	fields : {
		main : {
			width : "90%",
			top : 20,
			height : ANDROID?40:30,
			borderWidth:ANDROID?0:1,
			font:{
				fontSize:ANDROID?12:14
			},
			borderColor:"black"
		}
	},
	buttons : {
		close : {
			width : 80,
			height : 30,
			left : 20,
			title : "Close"
		},
		ok : {
			width : 80,
			height : 30,
			right : 20,
			title : "OK"
		}
	}
};

exports.create = function(callback) {

	var ti = {
		window : Ti.UI.createScrollView(cfg.window),
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
	});

	ti.buttons.ok.addEventListener("click", function() {
		if (ti.fields.main.value != "") {
			callback(ti.fields.main.value);
			ti.window.visible = false; 
		} else {
			alert("Please enter a name");
		}
	});

	ti.views.buttons.add(ti.buttons.close);
	ti.views.buttons.add(ti.buttons.ok);

	ti.views.main.add(ti.labels.main);
	ti.views.main.add(ti.fields.main);
	ti.views.main.add(ti.views.buttons);

	ti.window.add(ti.views.cover);
	ti.window.add(ti.views.main);
	
	ti.window.open = function(){
		
		ti.fields.main.value = "";
		
		ti.window.visible = true;
		
	};

	return ti.window;

};
