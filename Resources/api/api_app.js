var App;

var User = require("api/api_user");
var Transactions = require("api/api_transactions");

exports.User = User; 
exports.Transactions = Transactions; 

var handleOnError = function(error, params) {
	App.LOG("Handle on error "+JSON.stringify(error));
};

var handleOnLoad = function(response,params) {
	var responseType = "application/json";

	if (response.source.getResponseHeader("Content-Type") && response.source.getResponseHeader("Content-Type") == responseType) {
		App.LOG("App.API xhr.onload Response [" + response.source.getResponseHeader("Content-Type") + "]");
		params.callback(response, params);
	} else {
		App.LOG("App.API xhr.onload Content-Type: " + response.source.getResponseHeader("Content-Type"));
		Ti.API.error(" * * * * Invalid response format " + response.source.responseText);
		Ti.UI.createAlertDialog({
			title : "Server Response Error",
			message : "The server did not respond correctly.\nPerhaps you entered an invalid URL?" + "\nDebugging: (response not JSON)\n" + response.source.responseText
		}).show();
		App.UI.hideWait();
	}
};

var createHTTPClient = function(params) {

	var xhr = Ti.Network.createHTTPClient();

	xhr.timeout = 30000;

	xhr.onerror = function(e) {
		handleOnError(e, params);
	};

	xhr.onreadystatechange = function(e) {
	};

	xhr.onload = function(response) {
		handleOnLoad(response,params);
		xhr = null;
	};

	return xhr;
};

exports.send = function(params) {

	App.LOG("App.API.send Sending " + params.method + " request to URL " + App.CONSTANTS.URL + params.path);
	App.LOG("App.API.send Sending payload " + JSON.stringify(params.data));

	var xhr = createHTTPClient(params)

	var url = (App.CONSTANTS.URL + params.path);

	try {

		xhr.open(params.method, url);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(params.method == "POST" ? params.data : null); 

	} catch(e) {
		Ti.UI.createAlertDialog({
			title : "Server Error",
			message : "The server at the given URL did not respond"
		}).show();
	}

};

exports.handleResponse = function(name, response, params, errorCallback,successCallback){
	
	App.LOG("App.API."+name+" handle response "+response.source.responseText);
	
	 if (response) {

        var responseObj;

        if (App._.isString(response.source.responseText) && App.Lib.Functions.isJSON(response.source.responseText)) {
            responseObj = JSON.parse(response.source.responseText);
        }

        if (responseObj && responseObj.Error) {
          //Error
			errorCallback(responseObj.Error, params);
        } else {
          //Success 
            successCallback(responseObj, params); 
        }
    }else{
    	App.LOG("App.API."+name+" no response");
    }
	
};

exports.initialize = function(app) {
	App = app;
	
	User.initialize(app);
	Transactions.initialize(app);
};
