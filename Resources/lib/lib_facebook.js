var fb = require('facebook');
fb.appid = 224818800979354;
//fb.permissions = ['offline_access'];
fb.forceDialogAuth = false;

var App, userData, profilePicture, friendsList = [], listErrorCounter = 0;

var gettingPics = false;

var loginAfterAPICall = function() {
	if (App.Models.User.userDataSet()) {
		App.API.User.login();
	}
};

var getMyProfilePic = function() {

	var httpClient = Ti.Network.createHTTPClient();

	httpClient.onload = function(e) {
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + "profilepics", "me.png");
		if (file) {
			file.write(this.responseData);
			App.UI.User.setProfilePicture(file);
		}
	};

	httpClient.onerror = function(e) {
		Ti.API.error("Problem Connecting to Facebook: " + e.error);
	};

	httpClient.open('GET', "https://graph.facebook.com/me/picture" + "?access_token=" + fb.accessToken);

	httpClient.send();

};

var afterGetUserData = function(eventData) {

	if (eventData.result) {
		var userData = JSON.parse(eventData.result);
		App.Models.User.setByName("user", userData);
		App.Models.User.save();
		getMyProfilePic();
		loginAfterAPICall();
	}

};

var getUserData = exports.getUserData = function() {
	Ti.API.info("Getting User Data");
	fb.requestWithGraphPath("me/", {}, "GET", afterGetUserData);
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

		if (!gettingPics) {
			getPics(0, friendsList.sort(App.Lib.Functions.sortFriends));
		}

		loginAfterAPICall();

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
	fb.requestWithGraphPath("me/friends", {}, "GET", afterRequestFriendsList);
};

var getPics = exports.getPics = function(index, friendsList) {

	if (Ti.Network.online) {

		gettingPics = true;

		if (friendsList && friendsList[index]) {

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
					App.UI.User.refreshPictures();
					App.UI.Friends.refreshPictures();

					file = null;

					if (index < friendsList.length - 1 && fb.loggedIn) {
						getPics(++index, friendsList);
					} else {
						gettingPics = false;
					}
				};

				httpClient.onerror = function(e) {
					Ti.API.info("Problem Connecting to Facebook " + e.error);
					getPics(++index, friendsList);
				};

				Ti.API.info("Sending request to  " + "https://graph.facebook.com/" + friendsList[index].id + "/picture");

				httpClient.open('GET', "https://graph.facebook.com/" + friendsList[index].id + "/picture" + "?access_token=" + fb.accessToken);
				httpClient.index = index;
				httpClient.send();
			} else {
				Ti.API.info("already has file for " + friendsList[index].name);

				if (index < friendsList.length - 1 && fb.loggedIn) {
					getPics(++index, friendsList);
				} else {
					gettingPics = false;
				}
			}
		} else {
			gettingPics = false;
		}
	}
};

exports.initialize = function(app) {
	App = app;
};

exports.isGettingPics = function() {
	return gettingPics;
};

exports.authorize = fb.authorize;
exports.logout = fb.logout; 

exports.afterLogin = function() {
	
	Ti.API.info("after login");

	getUserData();
	requestFriendList();

};

exports.loggedIn = function() {

	return fb.loggedIn; 

};

fb.addEventListener("login", function(e) {
	if (e.success) {
		App.login();
	}
});
