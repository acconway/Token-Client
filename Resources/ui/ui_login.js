var App;

var Android = Ti.Platform.name == "android";

var cfg = {
    win : {
        backgroundColor : "white",
         tabBarHidden:true,
        title:"Login"
    },
    views : {
        main : {
            width : "100%",
            height : "100%",
            layout : "vertical",
            backgroundColor : "transparent"
        }
    },
    labels : {
        title : {
            width : "auto",
            height : 50,
            text : "Working Title",
            font : {
                fontSize : 35,
                fontWeight : "bold"
            },
            color : "black",
            top : 75
        },
        help : {
            width : "auto",
            height : 30,
            text : "What is Working Title?",
            top : 75,
            font : {
                fontSize : 20
            }
        }
    },
    buttons : {
        facebook : {
            style : 'wide',
            top : 75
        }
    }
};

var ti = {
    win : Ti.UI.createWindow(cfg.win),
    views : {
        main : Ti.UI.createView(cfg.views.main)
    },
    labels : {
        title : Ti.UI.createLabel(cfg.labels.title),
        help : Ti.UI.createLabel(cfg.labels.help)
    },
    buttons : {
        facebook : Ti.Facebook.createLoginButton(cfg.buttons.facebook)
    }
};

var buildHierarchy = function() {

    ti.views.main.add(ti.labels.title);
    ti.views.main.add(ti.buttons.facebook);
    ti.views.main.add(ti.labels.help);
    
    ti.win.add(ti.views.main);
};

var addEventListeners = function() {

   Ti.Facebook.addEventListener('login', function(e) {
        if(e.success) {
            Ti.API.info("Logged in to Facebook Succesfully");
            App.Lib.Facebook.getUserData();
            App.UI.Home.open();
        }
    });
    
    ti.labels.help.addEventListener("click",function(){
        alert("I Don't Know");
    });

};

exports.initialize = function(app) {

    App = app;
    buildHierarchy();
    addEventListeners();

};

exports.getWin = function() {
    return ti.win;
};
