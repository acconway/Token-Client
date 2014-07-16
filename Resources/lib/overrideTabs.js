/**
 * Override a tab group's tab bar on iOS.
 *
 * NOTE: Call this function on a tabGroup AFTER you have added all of your tabs to it! We'll look at the tabs that exist
 * to generate the overriding tab bar view. If your tabs change, call this function again and we'll update the display.
 *
 * @param tabGroup The tab group to override
 * @param backgroundOptions The options for the background view; use properties like backgroundColor, or backgroundImage.
 * @param selectedOptions The options for a selected tab button.
 * @param deselectedOptions The options for a deselected tab button.
 */
var fonts = {
	black : "GoudySans Blk BT",
	bold : "GoudySans Md BT",
	book : "GoudySans LT Book",
	italic : "GoudySans LT Book Italic",
	medium : "GoudySans Md BT Medium"
};

var cfg = {
	label : {
		bottom : 2,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		color : "white",
		font : {
			fontFamily : fonts.bold,
			fontSize : 14
		}
	},
	icon : {
		top : 5,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE
	},
	background : {
		height : 55,
		left : 0,
		right : 0,
		bottom : 0
	},
	selected : {
		top : 0,
		bottom : 0,
		visible : false
	},
	deselected : {
		top : 0,
		bottom : 0,
	}
};

exports.overrideTabs = function(tabGroup) {

	var background = Ti.UI.createView(cfg.background);

	background.touchEnabled = false;

	var increment = 100 / tabGroup.tabs.length;
	cfg.deselected.width = cfg.selected.width = increment + '%';

	for (var i = 0, l = tabGroup.tabs.length; i < l; i++) {

		var tab = tabGroup.tabs[i];

		cfg.selected.left = cfg.deselected.left = increment * i + '%';

		var icon0 = Ti.UI.createImageView(cfg.icon);

		icon0.image = tab.icon;

		var label0 = Ti.UI.createLabel(cfg.label);

		label0.text = tab.title;

		var icon1 = Ti.UI.createImageView(cfg.icon);

		icon1.image = tab.icon;

		var label1 = Ti.UI.createLabel(cfg.label);

		label1.text = tab.title;

		tab.deselected = Ti.UI.createView(cfg.deselected);

		tab.deselected.add(icon0);
		tab.deselected.add(label0);

		tab.selected = Ti.UI.createView(cfg.selected);

		tab.selected.add(icon1);
		tab.selected.add(label1);

		background.add(tab.deselected);
		background.add(tab.selected);

	}

	// update the tab group, removing any old overrides
	if (tabGroup.overrideTabs) {
		tabGroup.remove(tabGroup.overrideTabs);
	} else {
		tabGroup.addEventListener('focus', overrideFocusTab);
	}

	tabGroup.add(background);
	tabGroup.overrideTabs = background;
};

function overrideFocusTab(evt) {
	if (evt.previousIndex >= 0) {
		evt.source.tabs[evt.previousIndex].selected.visible = false;
	}
	evt.tab.selected.visible = true;
}; 