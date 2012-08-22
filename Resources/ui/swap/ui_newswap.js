var cfg = {
	views : {
		main : {
			width : "80%",
			top:60,
			height : 200,
			visible : false,
			backgroundColor : "white",
			borderWidth : 2,
			borderRadius : 10,
			borderColor : "black",
			layout : "vertical"
		},
		buttons : {
			width : "100%",
			height : 50,
			top : 20,
			layout : "horizontal"
		}
	},
	labels : {
		main : {
			height : 30,
			width : "auto",
			top : 10,
			text : "Create new",
			color : "black"
		}
	},
	fields : {
		main : {
			width : "80%",
			height : 30,
			top : 20,
			hintText : "  Input new action",
			borderColor : "black",
			borderWidth : 1
		}
	},
	buttons : {
		ok : {
			width : 80,
			height : 30,
			left : 32,
			title : "OK"
		},
		cancel : {
			width : 80,
			height : 30,
			left : 32,
			title : "Cancel"
		}
	}
};

exports.create = function(callback,background) {

	var ti = {
		self : Ti.UI.createView(cfg.views.main),
		views : {
			buttons : Ti.UI.createView(cfg.views.buttons)
		},
		labels : {
			main : Ti.UI.createLabel(cfg.labels.main)
		},
		fields : {
			main : Ti.UI.createTextField(cfg.fields.main)
		},
		buttons : {
			ok : Ti.UI.createButton(cfg.buttons.ok),
			cancel : Ti.UI.createButton(cfg.buttons.cancel)
		}
	};

	ti.self.add(ti.labels.main);

	ti.self.add(ti.fields.main);

	ti.views.buttons.add(ti.buttons.cancel);
	ti.views.buttons.add(ti.buttons.ok);

	ti.self.add(ti.views.buttons);


	ti.self.open = function() {
		ti.fields.main.value = "";
		background.visible = true; 
		ti.self.visible = true;
	}

	ti.self.close = function() {
		ti.self.visible = false;
		background.visible = false; 
	}

	ti.buttons.cancel.addEventListener("click", function() {
		ti.self.close();
	});

	ti.buttons.ok.addEventListener("click", function() {
		callback(ti.fields.main.value);
		ti.self.close();
	});

	return ti.self;

};
