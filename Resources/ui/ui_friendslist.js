var App, listErrorCounter = 0, friends = [], indexHeader = "0", tableIndex = [], indexCounter = 0, rowData = [], userData = {}, mode;

var _ = require('/lib/lib_underscore')._;

var Android = Ti.Platform.name == "android";

var cfg = {
    win : {
        // title:"Recipients",
        backgroundColor : 'transparent',
         tabBarHidden:true,
        orientationModes : [Titanium.UI.PORTRAIT]
    },
    views : {
        main : {
            contentWidth : "auto",
            contentHeight : 450,
            top : Android ? 45 : 0,
            showVerticalScrollIndicator : false,
            showHorizontalScrollIndicator : false
        },
        nav : {
            top : Android ? 45 : 0,
            height : 44,
            backgroundColor : "black",
            enabled : false
        },
        title : {
            height : 1,
            top : 43,
            backgroundColor : "black"
        },
        row : {
            top : 10,
            height : 62,
            width : 232,
            backgroundColor : "white"
        }
    },
    table : {
        top : Android ? 45 : 0,
        minRowHeight : 50,
        filterAttribute : 'sortName'
    },
    labels : {
        title : {
            text : "friends",
            font : {
                fontSize : 20,
                fontWeight : 'bold'
            }
        },
        friend : {
            font : {
                fontSize : 16,
                fontWeight : 'bold'
            },
            left : 70,
            top : 5,
            right : 5,
            height : 25,
            color : "black"
        }
    },
    images : {
        friend : {
            left : 10,
            width : 50,
            height : 50
        }
    },
    buttons : {
        close : {
            title : 'close'
        }
    },
    row : {
        height : 'auto',
        backgroundColor : '#fff'
    },
    search : {
        barColor : '#385292',
        showCancel : false,
        hintText : 'search'
    },
    animations : {
        open : {
            opacity : 1,
            duration : 500
        },
        close : {
            opacity : 0,
            duration : 300
        }
    }
};

var ti = {
    win : Ti.UI.createWindow(cfg.win),
    views : {
        main : Ti.UI.createView(cfg.views.main),
        nav : Ti.UI.createView(cfg.views.title),
        title : Ti.UI.createView(cfg.views.title)
    },
    table : Ti.UI.createTableView(cfg.table),
    rows : {},
    labels : {
        title : Ti.UI.createView(cfg.views.title)
    },
    buttons : {
        close : Ti.UI.createButton(cfg.buttons.close)
    },
    images : {},
    search : Ti.UI.createSearchBar(cfg.search),
    animations : {
        open : Ti.UI.createAnimation(cfg.animations.open),
        close : Ti.UI.createAnimation(cfg.animations.close)
    }
};

var addEventListeners = function() {

    ti.buttons.close.addEventListener('click', function(e) {
        ti.win.close();
    });

    ti.table.addEventListener('click', function(e) {
        if (!e.row) {
            return;
        }
        var rowdata = e.row;
        if (mode == "swap") {
            App.UI.Home.MakeNewSwap.setToName(App.Lib.Facebook.getShortName(rowdata.label.text));
        }
        ti.win.close();
    });

};
// function addRow is passed single friend object parameter (element of friends[])
// creates tableviewrow with name and picture from friend parameter, adds it to rowData

var addRow = function(friend) {

    var row = Ti.UI.createTableViewRow(cfg.row);
    row.sortName = friend.name;

    indexCounter++;

    if (friend.name[0].toUpperCase() != indexHeader) {
        indexHeader = friend.name[0].toUpperCase();
        tableIndex.push({
            title : indexHeader,
            index : indexCounter - 1
        });
        row.header = indexHeader;
    }

    row.label = Ti.UI.createLabel(cfg.labels.friend);
    row.label.text = friend.name;
    row.image = Ti.UI.createImageView(cfg.images.friend);

    // row.image.image = friend.image;

    row.id = friend.id;
    row.add(row.label);
    row.add(row.image);

    return row;
};

var buildRows = function() {

    _.each(friends, function(friend) {
        rowData.push(addRow(friend));
    });

};

var updateTable = function() {
    Ti.API.debug("App.UI.Recipients.updateTable");
    rowData = [];
    indexCounter = 0;
    tableIndex = [];
    tableIndex.push({
        title : "{search}",
        index : 0
    });
    buildRows();
    //  updateImages();
    ti.table.setData(rowData);
    ti.table.index = tableIndex;
    // Ti.API.debug(JSON.stringify(tableIndex));
};

var buildHierarchy = function() {

    ti.views.title.add(ti.labels.title);
    ti.views.nav.add(ti.views.title);
    ti.win.add(ti.views.nav);
    ti.win.add(ti.table);
    ti.table.search = ti.search;
    ti.win.leftNavButton = ti.buttons.close;

};

var sort = function(friend0, friend1) {
    var name0 = friend0.name.toLowerCase(), name1 = friend1.name.toLowerCase();
    if (name0 < name1) {
        return -1;
    } else if (name0 > name1) {
        return 1;
    } else {
        return 0;
    }
};

var addPic = function(index, file) {
    if (!friends || friends.length < 1) {
        return;
    }
    try {
        if (rowData && rowData[index] != undefined) {
            rowData[index].image.image = file;
        }
    } catch(err) {

    }
};

//function getPics queries Facebook server to get profile pictures for each element in
//list and update them. Recursive function, after each succesful call it calls getPics again with
// index incremented by one until all pictures have been loaded

var getPics = function(index) {
    if (friends[index]) {
        var httpClient = Ti.Network.createHTTPClient();

        httpClient.onload = function(e) {

            var file = Ti.Filesystem.createTempFile(Ti.Filesystem.resourcesDirectory);
            file.write(this.responseData);
            if (file === null) {
                index = friends.length;
            }

            addPic(index, file);
            if (index < friends.length - 1 && Ti.Facebook.loggedIn) {
                getPics(++index);
            }
        };
        httpClient.onerror = function(e) {
            Ti.API.info("Problem Connecting to Facebook");
            getPics(index);
        };
        httpClient.open('GET', "https://graph.facebook.com/" + friends[index].id + "/picture" + "?access_token=" + Ti.Facebook.accessToken);
        httpClient.index = index;
        httpClient.send();
    }
};



// function update makes call to Facebook Graph API for list of user's friends
var update = function() {
    Ti.Facebook.requestWithGraphPath("me/friends", {}, "GET", getList);
};

/*
 function getList is passed in to Facebook Graph API request for list of user's Friends
 If the request returns succesfully, friend list is stored and function addPics is called
 If the request returns an error, Friends.update() is called again until the request succeeds,
 a maximum of 5 attempts until the error is alerted to user and returned to the menu
 */

var getList = function(eventData) {
    friends = [];
    if (eventData.result) {
        listErrorCounter = 0;
        var result = JSON.parse(eventData.result);
        friends = result.data;
        friends.sort(sort);
        Ti.API.info("Friend's List " + JSON.stringify(friends));
        if (!_.isEmpty(friends)) {
            getPics(0);
        }
        updateTable();
    } else {
        listErrorCounter += 1;
        if (listErrorCounter < 5) {
            update();
        } else {
            alert({
                title : "Facebook Connection Problem",
                message : eventData.error
            });
        }
    }
};

exports.open = function(_mode) {

    mode = _mode;

    ti.win.open({
        modal : true
    });
    update();
};

exports.initialize = function(app) {
    Ti.API.debug("App.UI.Recipients.initialize");
    App = app;
    buildHierarchy();
    addEventListeners();
};
