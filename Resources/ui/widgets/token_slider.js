var cfg = {
	views : {
		main : {
			top : 20,
			width : "90%",
			height : 80,
			backgroundColor : "white",
			borderWidth : 1,
			borderColor : "white",
			borderRadius : 2,
			layout : "vertical"
		},
		prompt : {
			top : 10,
			width : 120,
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
		prompt : {
			width : 80,
			height : 20,
			color : "black",
			text : "Last time: "
		},
		promptValue : {
			left : 10,
			color : "black",
			width : 30,
			height : 20
		},
		value : {
			top : 15,
			color : "black",
			width : "auto",
			height : 20,
			text : "1",
			font : {
				fontSize : 18,
				fontWeight : "light"
			}
		}
	},
	slider : {
		top : 15,
		min : 0,
		max : 10,
		width : "80%",
		value : 1
	}
};

exports.create = function() {

	var ti = {
		self : Ti.UI.createView(cfg.views.main),
		views : {
			prompt : Ti.UI.createView(cfg.views.prompt),
			buttons : Ti.UI.createView(cfg.views.buttons)
		},
		labels : {
			prompt : Ti.UI.createLabel(cfg.labels.prompt),
			promptValue : Ti.UI.createLabel(cfg.labels.promptValue),
			value : Ti.UI.createLabel(cfg.labels.value)
		},
		slider : Ti.UI.createSlider(cfg.slider)
	};

	ti.views.prompt.add(ti.labels.prompt);
	ti.views.prompt.add(ti.labels.promptValue);

	//ti.self.add(ti.views.prompt);

	ti.self.add(ti.labels.value);

	ti.self.add(ti.slider);

	ti.slider.addEventListener('change', function(e) {
		ti.labels.value.text = Math.floor(e.value);
	});

	ti.self.update = function(value, max, selectedAction) {

		if (!value) {
			value = 1;
		}

		ti.self.remove(ti.slider);

		ti.slider = Ti.UI.createSlider({
			top : 10,
			min : 0,
			max : Math.min(3, max),
			width : "80%",
			value : Math.min(value, max)
		});

		ti.slider.addEventListener('change', function(e) {
			ti.labels.value.text = Math.floor(e.value);
		});

		ti.self.add(ti.slider);

		ti.labels.value.text = value;

		if (selectedAction) {
			ti.labels.promptValue.text = value;
			ti.views.prompt.visible = true;
		} else {
			ti.views.prompt.visible = false;
		}

	};

	ti.self.getValue = function() {
		return Math.floor(ti.slider.value);
	};

	return ti.self;
};
