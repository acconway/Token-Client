var App;

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
            text : "Token",
            font : {
                fontSize : 35,
                fontWeight : "bold"
            },
            color : "black",
            top : 75
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
        title : Ti.UI.createLabel(cfg.labels.title)
    },
    buttons : {
        facebook : Ti.Facebook.createLoginButton(cfg.buttons.facebook)
    }
};

var buildHierarchy = function() {

    ti.views.main.add(ti.labels.title);
    ti.views.main.add(ti.buttons.facebook);
    
    ti.win.add(ti.views.main);
};

var addEventListeners = function() {};

exports.initialize = function(app) {

    App = app;
    buildHierarchy();
    addEventListeners();

};

exports.getWin = function() {
    return ti.win;
};
