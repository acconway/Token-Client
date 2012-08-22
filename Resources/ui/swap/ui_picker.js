var _ = require('/lib/lib_underscore')._;

var cfg = {
	views : {
		main : {
			bottom : -200,
			width : "100%",
			height : 200,
			backgroundColor : "gray"
		}
	},
	labels : {
		rowName : {
			left : 10,
			height : 30,
			width : 200,
			textAlign : "left"
		},
		rowValue : {
			left : 10,
			width : "auto",
			height : 30
		}
	},
	table : {
		width : "100%",
		height : 170,
		top : 30,
		backgroundColor : "white"
	},
	row : {
		width : "100%",
		height : 30,
		backgroundColor : "white",
		layout : "horizontal"
	},
	buttons : {
		close : {
			top : 5,
			left : 10,
			height : 20,
			title : "close"
		}
	}
};

var buildRow = function(data, option) {

	var row = Ti.UI.createTableViewRow(cfg.row);

	var name = Ti.UI.createLabel(cfg.labels.rowName);
	var value = Ti.UI.createLabel(cfg.labels.rowValue);

	name.text = option.name;
	value.text = option.value;

	row.add(name);
	row.add(value);

	data.push(row);
};

var buildTable = function(table, options) {

	var data = [];

	buildRow(data, {
		name : "Create new action",
		value : ""
	});

	_.each(options, function(option) {
		buildRow(data, option)
	});

	table.setData(data);

};

exports.create = function(options) {

	var ti = {
		self : Ti.UI.createView(cfg.views.main),
		table : Ti.UI.createTableView(cfg.table),
		buttons : {
			close : Ti.UI.createButton(cfg.buttons.close)
		}
	};

	ti.buttons.close.addEventListener("click", function(e) {
		ti.self.animate({
			bottom : -200,
			duration : 300
		});
	});

	ti.self.open = function() {
		ti.self.animate({
			bottom : 0,
			duration : 300
		});
	}
	
	ti.self.close = function(){
		ti.self.animate({
			bottom : -200,
			duration : 300
		});
	}
	
	buildTable(ti.table, options);

	ti.self.add(ti.buttons.close);

	ti.self.add(ti.table)

	ti.self.table = ti.table;

	return ti.self;
};
