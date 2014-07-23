var _ = require('/lib/underscore')._;

var readString = function(key) {
	var value = Ti.App.Properties.getString(key,null);
	if (_.isNull(value)) {
		return null;
	} else {
		return JSON.parse(value);
	}
};

exports.save = function(key,data) {
	if (!key) {key = "all";}
	Ti.API.debug("App.Data.save("+key+"): "+(data ? JSON.stringify(data) : null));	
	Ti.App.Properties.setString(key,(data ? JSON.stringify(data) : null));
};

exports.read = function(key) {
	return readString(key ? key : "all");	
};