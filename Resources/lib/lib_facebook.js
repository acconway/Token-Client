Ti.Facebook.appid = "142078199250182";
Ti.Facebook.permissions = ['publish_stream', 'read_stream', 'offline_access'];

var App, userData, profilePicture, friendsList = [];

var getMyProfilePic = function() {

	var httpClient = Ti.Network.createHTTPClient();

	httpClient.onload = function(e) {
		var file = Ti.Filesystem.createTempFile(Ti.Filesystem.resourcesDirectory);
		file.write(this.responseData);
		profilePicture = file;
	};
	httpClient.onerror = function(e) {
		Ti.API.error("Problem Connecting to Facebook: " + e.error);
	};
	
	httpClient.open('GET', "https://graph.facebook.com/me/picture" + "?access_token=" + Ti.Facebook.accessToken);
	
	httpClient.send();

};

var afterGetUserData = function(eventData) {

	if (eventData.result) {
		var userData = JSON.parse(eventData.result);
		App.Models.User.setByName("user",userData); 
		App.Models.User.save(); 
		getMyProfilePic();
	}

};

var getUserData = exports.getUserData = function() {
	Ti.API.info("Getting User Data");
	Ti.Facebook.requestWithGraphPath("me/", {}, "GET", afterGetUserData);
};


var afterRequestFriendsList = function(eventData) {
	if (eventData.result) {
		listErrorCounter = 0;
		App.Models.User.setByName("friendsList",JSON.parse(eventData.result).data); 
		App.Models.User.save(); 
		App.UI.Friends.FacebookFriendList.updateTable(); 
	} else {
		listErrorCounter += 1;
		if (listErrorCounter < 5) {
			requestFriendList(); 
		} else {
			alert({
				title : "Facebook Connection Problem",
				message : eventData.error
			});
		}
	}
};

var requestFriendList = exports.requestFriendsList = function() {
	Ti.Facebook.requestWithGraphPath("me/friends", {}, "GET", afterRequestFriendsList);
};

exports.getProfilePicForID = function(id, index, callback) {

	var httpClient = Ti.Network.createHTTPClient();

	httpClient.onload = function(e) {

		var file = Ti.Filesystem.createTempFile(Ti.Filesystem.resourcesDirectory);
		file.write(e.source.responseData);

		Ti.API.info("Recieved profile picture for id " + id + " index " + index);

		callback(file, e.source.index);
	};

	httpClient.onerror = function(e) {
		Ti.API.info("Problem Connecting to Facebook");
	};

	Ti.API.info("Sending request to  " + "https://graph.facebook.com/" + id + "/picture" + "?access_token=" + Ti.Facebook.accessToken);

	httpClient.open('GET', "https://graph.facebook.com/" + id + "/picture" + "?access_token=" + Ti.Facebook.accessToken);
	httpClient.index = index;
	httpClient.send();

};

exports.initialize = function(app) {
	App = app;
};

var afterLogin = exports.afterLogin = function(){
	
	getUserData();
	requestFriendList(); 
	
};

Ti.Facebook.addEventListener("login",function(){
	App.login(); 
});