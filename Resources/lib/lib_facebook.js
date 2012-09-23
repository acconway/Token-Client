Ti.Facebook.appid = "142078199250182";
Ti.Facebook.permissions = ['publish_stream', 'read_stream', 'offline_access'];

var App, userData, profilePicture, friendsList = [], listErrorCounter = 0;

var gettingPics = false;

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
		App.Models.User.setByName("user", userData);
		App.Models.User.save();
		getMyProfilePic();
		App.API.User.login();
	}

};

var getUserData = exports.getUserData = function() {
	Ti.API.info("Getting User Data");
	Ti.Facebook.requestWithGraphPath("me/", {}, "GET", afterGetUserData);
};

var afterRequestFriendsList = function(eventData) {
	if (eventData.result) {
		listErrorCounter = 0;

		var friendsList = JSON.parse(eventData.result).data;

		var friendsListNameLookup = {};

		App._.each(friendsList, function(friend) {
			friendsListNameLookup[friend.id] = friend.name;
		});

		App.Models.User.setByName("friendsList", friendsList);
		App.Models.User.setByName("friendsListLookup", friendsListNameLookup);
		App.Models.User.save();

		getPics(0, friendsList.sort(App.Lib.Functions.sortFriends));

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

var getPics = exports.getPics = function(index, friendsList) {

	if (Ti.Network.online) {

		gettingPics = true;

		if (friendsList[index]) {

			var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "profilepics", friendsList[index].id + ".png");

			if (!file.exists()) {

				var httpClient = Ti.Network.createHTTPClient();

				httpClient.onload = function(e) {

					file.write(this.responseData);

					Ti.API.info("Recieved profile picture for id " + friendsList[index].id + " name " + friendsList[index].name + " index " + index);

					if (!App.ANDROID) {
						App.UI.Send.SelectFriend.FacebookFriendList.addPicture(index);
					}
					App.UI.Send.SelectFriend.refreshPictures();
					App.UI.Friends.refreshPictures();
				
					file = null; 

					if (index < friendsList.length - 1 && Ti.Facebook.loggedIn) {
						getPics(++index, friendsList);
					} else {
						gettingPics = false;
					}
				};

				httpClient.onerror = function(e) {
					Ti.API.info("Problem Connecting to Facebook");
					getPics(index);
				};

				Ti.API.info("Sending request to  " + "https://graph.facebook.com/" + friendsList[index].id + "/picture");

				httpClient.open('GET', "https://graph.facebook.com/" + friendsList[index].id + "/picture" + "?access_token=" + Ti.Facebook.accessToken);
				httpClient.index = index;
				httpClient.send();
			} else {
				Ti.API.info("already has file for " + friendsList[index].name);

				if (index < friendsList.length - 1 && Ti.Facebook.loggedIn) {
					getPics(++index, friendsList);
				} else {
					gettingPics = false;
				}
			}
		}
	}
};

exports.initialize = function(app) {
	App = app;
};

exports.afterLogin = function() {

	getUserData();
	requestFriendList();

};

Ti.Facebook.addEventListener("login", function() {
	Ti.API.info("Login");
	App.login();
});
