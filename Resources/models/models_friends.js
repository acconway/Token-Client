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
	App.LOG("App.Models.Friends adding friend with name: "+name+" id: "+id);
	if (name && id) {
		var record = model.newRecord({
			userID : id,
			name : name
		});
		record.save();
	}
};

var hasFriend = function(id){
	
	friend = this.findOneBy("userID", id);
	
	return friend; 

};

exports.initialize = function(app) {
	App = app;

	model = new App.DB.model({
		table : schema.table,
		columns : schema.columns,
		methods : {
			addFriend:addFriend,
			hasFriend:hasFriend
		},
		objectMethods : {}
	});

	return model;
};

