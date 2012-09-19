var App; 

var afterLogin = function(response){
	Ti.API.info(JSON.stringify(response));
}; 

exports.login = function(){
	
	var payload = {
		userID:App.Models.User.getMyID() 
	};
	
	 App.API.send({
        method : "POST",
        path : "/login",
        data : payload,
        callback : afterReLogon
    });
}; 


exports.initialize = function(app){
	App = app; 
};
