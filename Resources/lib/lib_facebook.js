Ti.Facebook.appid = "142078199250182";
Ti.Facebook.permissions = ['publish_stream', 'read_stream', 'offline_access'];

var App, userName = "", userData = {}, profilePicture;

var getMyProfilePic = function() {

    var httpClient = Ti.Network.createHTTPClient();

    httpClient.onload = function(e) {
        var file = Ti.Filesystem.createTempFile(Ti.Filesystem.resourcesDirectory);
        file.write(this.responseData);
        profilePicture = file;
     	
        App.UI.Home.update();
    };
    httpClient.onerror = function(e) {
        Ti.API.error("Problem Connecting to Facebook: " + e.error);
    };
    httpClient.open('GET', "https://graph.facebook.com/me/picture" + "?access_token=" + Ti.Facebook.accessToken);
    httpClient.send();

};

exports.getProfilePicForID = function (id,index, callback) {
	    
    var httpClient = Ti.Network.createHTTPClient();

    httpClient.onload = function(e) {

        var file = Ti.Filesystem.createTempFile(Ti.Filesystem.resourcesDirectory);
        file.write(e.source.responseData);
        
        Ti.API.info("Recieved profile picture for id "+id+" index "+index);

        callback(file, e.source.index);
    };

    httpClient.onerror = function (e) {
        Ti.API.info("Problem Connecting to Facebook");
    };

    Ti.API.info("Sending request to  "+"https://graph.facebook.com/" + id + "/picture" + "?access_token=" + Ti.Facebook.accessToken);
    
    httpClient.open('GET', "https://graph.facebook.com/" + id + "/picture" + "?access_token=" + Ti.Facebook.accessToken);
    httpClient.index = index;
    httpClient.send();

};

var getMyName = function(eventData) {

    if (eventData.result) {
    	Ti.API.info("GOT MY NAME");
        var list = JSON.parse(eventData.result);
        userData = list;
        userName = list.name;
        getMyProfilePic();
    }

};

var getUserData = exports.getUserData = function() {
    Ti.API.info("Getting User Data");
    Ti.Facebook.requestWithGraphPath("me/", {}, "GET", getMyName);
};

exports.initialize = function(app) {
    App = app;
};

exports.getProfilePic = function() {
    return profilePicture;
};
exports.getUserName = function() {
    return userName;
};

exports.getUserShortName = function() {
    return getShortName(userName);
};

var getShortName = exports.getShortName = function(name) {
    var array = name.split(" ");

    var shortName = array[0];

    if (array.length > 1) {
        shortName += " " + array[array.length - 1].charAt(0) + ".";
    }

    return shortName;
};
