var { ToggleButton } = require('sdk/ui/button/toggle'),
	self = require("sdk/self"),
	panels = require("sdk/panel"),
	tabs = require("sdk/tabs");

var button = ToggleButton({
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "16": "./img/icon-16.png",
    "32": "./img/icon-32.png",
    "64": "./img/icon-64.png"
  },
  onClick: handleClick
});

var panel = panels.Panel({
	contentURL: self.data.url("index.html"),
	contentScriptFile: self.data.url("./js/app.js"),
	contentScriptWhen : "end",
	onHide: handleHide
});

function handleClick(state) {
	if (state.checked) {
		panel.show({
			position: button
		});
	}
}

function handleHide() {
	button.state('window', {checked: false});
}

panel.on("show",function(){
	panel.port.emit("resource");
});

panel.port.on('newTab',function(link){
	tabs.open(link);
});
