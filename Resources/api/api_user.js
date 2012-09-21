var App; 

var loginHandleError = function(error,params){
	//Handle Error
};

var loginHandleSuccess = function(response,params){
	App.LOG("App.API.User login success!");
	App.API.Transactions.syncTransactions(0); 
}; 

var afterLogin = function(response, params){
	App.API.handleResponse("login",response,params,loginHandleError,loginHandleSuccess); 
}; 

exports.login = function(){
	
	var payload = {
		userID:App.Models.User.getMyID() 
	};
	
	 App.API.send({
        method : "POST",
        path : "/login",
        data : payload,
        callback : afterLogin
    });
}; 


exports.initialize = function(app){
	App = app; 
};
