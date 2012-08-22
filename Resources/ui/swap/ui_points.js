var cfg = {
	views : {
		main : {
			width : "80%",
			height : 200,
			visible : false,
			backgroundColor : "white",
			borderWidth : 2,
			borderRadius : 10,
			borderColor : "black",
			layout : "vertical"
		},
		prompt : {
			top : 10,
			width : 150,
			height : 30,
			layout : "horizontal"
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
			text : "Assign Paris",
			color : "black"
		},
		prompt : {
			width : "auto",
			height : 20,
			text : "Last time: "
		},
		promptValue : {
			left : 10,
			width : "auto",
			height : 20
		},
		value : {
			top : 10,
			width : "auto",
			height : 20,
			text : "1"
		}
	},
	slider : {
		top : 10,
		min : 1,
		max : 10,
		width : "80%",
		value : 1
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

exports.create = function(callback, background) {

	var ti = {
		self : Ti.UI.createView(cfg.views.main),
		views : {
			prompt : Ti.UI.createView(cfg.views.prompt),
			buttons : Ti.UI.createView(cfg.views.buttons)
		},
		labels : {
			main : Ti.UI.createLabel(cfg.labels.main),
			prompt : Ti.UI.createLabel(cfg.labels.prompt),
			promptValue : Ti.UI.createLabel(cfg.labels.promptValue),
			value : Ti.UI.createLabel(cfg.labels.value)
		},
		slider : Ti.UI.createSlider(cfg.slider),
		buttons : {
			ok : Ti.UI.createButton(cfg.buttons.ok),
			cancel : Ti.UI.createButton(cfg.buttons.cancel)
		}
	};

	ti.self.add(ti.labels.main);

	ti.views.prompt.add(ti.labels.prompt);
	ti.views.prompt.add(ti.labels.promptValue);

	ti.self.add(ti.views.prompt);

	ti.self.add(ti.labels.value);

	ti.self.add(ti.slider);

	ti.views.buttons.add(ti.buttons.cancel);
	ti.views.buttons.add(ti.buttons.ok);

	ti.self.add(ti.views.buttons);

	ti.slider.addEventListener('change', function(e) {
		ti.labels.value.text = String.format("%1.0f", Math.floor(e.value));
	});

	ti.self.open = function(value, max, selectedAction) {

		background.visible = true;

		if (value) {
			if (selectedAction) {
				ti.slider.value = value;
				ti.labels.value.text = value;
			}
			ti.labels.promptValue.text = value;
			ti.views.prompt.visible = true;
		} else {
			ti.views.prompt.visible = false;
		}

		ti.slider.max = max;

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
		callback(ti.labels.value.text);
		ti.self.close();
	});

	return ti.self;
};
