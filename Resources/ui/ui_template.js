var App;

var cfg = {
    win : {},
    views : {},
    labels : {},
    buttons : {}
};

var ti = {
    win:"",
    views:{},
    labels:{},
    buttons:{}
};

var buildHierarchy = function(){
    
};

var addEventListeners = function(){
    
};

exports.initialize = function(app){
    App = app;
    buildHierarchy();
    addEventListeners();
};

exports.getWin = function(){
    return ti.win;
}
