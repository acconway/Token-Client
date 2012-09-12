var App, model;

var schema = {
	table : "friends",
	columns : {
		id : 'INTEGER PRIMARY KEY',
		userID : 'INTEGER',
		name : 'TEXT'
	}
};

var addFriend = function(name, id) {
	if (name && id) {
		var record = model.newRecord({
			userID : id,
			name : name
		});
		record.save();
	}
};

exports.initialize = function(app) {
	App = app;

	model = new App.DB.model({
		table : schema.table,
		columns : schema.columns,
		methods : {
			addFriend:addFriend
		},
		objectMethods : {}
	});

	return model;
};

