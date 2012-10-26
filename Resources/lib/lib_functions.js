exports.getShortName = function(name) {
	var array = name.split(" ");

	var shortName = array[0];

	if (array.length > 1) {
		shortName += " " + array[array.length - 1].charAt(0) + ".";
	}

	return shortName;
};

var sort = exports.sort = function(string0, string1) {
	if (string0 && string1) {
		var name0 = string0.toLowerCase(), name1 = string1.toLowerCase();
		if (name0 < name1) {
			return -1;
		} else if (name0 > name1) {
			return 1;
		} else {
			return 0;
		}
	}else{
		return 0; 
	}
};

exports.sortFriends = function(friend0, friend1) {
	return sort(friend0.name, friend1.name);
};

exports.createNotificationMessage = function(transaction) {
	//if()

};

exports.removeWhitespace = function(string){
	return string.replace(/\s+/g, '');
};

exports.isJSON = function(string) {
	try {
		JSON.parse(string);
		return true;
	} catch(e) {
		return false
	}
};
