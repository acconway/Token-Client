var App, model;

var schema = {
	table : "transactions",
	columns : {
		id:'id',
		senderID : 'INTEGER',
		recipientID : 'INTEGER',
		tokenValue : 'INTEGER',
		actionName : "TEXT",
		comment : "TEXT",
		time : 'INTEGER'
	}
};

exports.initialize = function(app) {
	App = app;

	model = new App.DB.model({
		table : schema.table,
		columns : schema.columns,
		methods : {},
		objectMethods : {}
	});

	return model;
};
