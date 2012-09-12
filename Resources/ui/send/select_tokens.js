var App, actions = [], rowData = [];

var friend,action; 

var TokenSlider = require("ui/widgets/token_slider");

var cfg = {
	win : {
		backgroundColor : "white",
		title : "Send Tokens",
		layout : "vertical"
	},
	views : {},
	labels : {
		friendName : {
			top : 20,
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 18,
				fontWeight : "bold"
			}
		},
		actionName : {
			top : 10,
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 16,
				fontWeight : "light"
			}
		},
		title : {
			left:10,
			top : 20,
			text : "Select amount of tokens",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE
		},
	},
	buttons : {
		send:{
			top:20,
			title:"Send",
			font:{
				fontSize:20
			},
			width:200,
			height:40
		}
	}
};

var ti = {
	win : Ti.UI.createWindow(cfg.win),
	labels : {
		friendName : Ti.UI.createLabel(cfg.labels.friendName),
		actionName: Ti.UI.createLabel(cfg.labels.actionName),
		title : Ti.UI.createLabel(cfg.labels.title)
	},
	buttons : {
		send:Ti.UI.createButton(cfg.buttons.send)
	}
};

var addEventListeners = function() {
	
	ti.buttons.send.addEventListener("click",function(){
		alert(friend.name+" "+action.name+" "+ti.slider.getValue());
		App.UI.Send.close();
	});
	
};

var buildHierarchy = function() {

	ti.win.add(ti.labels.friendName);
	
	ti.win.add(ti.labels.actionName);

	ti.win.add(ti.labels.title);
	
	ti.slider = TokenSlider.create()
	
	ti.win.add(ti.slider);
	
	ti.win.add(ti.buttons.send);
	
	ti.win.backButtonTitle = "Back";

};

exports.initialize = function(app) {
	App = app;
	buildHierarchy();
	addEventListeners();
};

exports.open = function(_friend,_action) {
	friend = _friend;
	action = _action; 
	ti.labels.friendName.text = friend.name;
	ti.labels.actionName.text = action.name; 
	ti.slider.update(null,5,false);
	App.UI.Send.openWindow(ti.win);
};
