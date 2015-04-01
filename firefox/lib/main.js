var { ToggleButton } = require('sdk/ui/button/toggle'),
	self = require("sdk/self"),
	panels = require("sdk/panel"),
	tabs = require("sdk/tabs"),
	_ = require('underscore'),
	UrlSite = "http://khaleesi.unisem.mx/admin/";

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
	contentScriptFile: self.data.url("./js/init.js"),
	contentScriptWhen : "end",
	onHide: handleHide
});

function handleClick(state) {
	if (state.checked) {
		panel.show({
			position: button
		});
		panel.port.emit('resource');
	}
}

function handleHide() {
	button.state('window', {checked: false});
}

// View Empty Task
function viewEmpty(){
	var html = '<div class="login"><div>No tienes tareas iniciadas, accede al sistema para iniciar una y "A darle átomos"</div><span class="btn" id="newTask">Crear nueva</span></div>';
	panel.port.emit('render',html);
}

// View Tasks
function viewTasks(tasks){
	templateHTML = '<% _.each(tasksList,function(x){ %><div class="task"><div class="detail"><span class="title"><%= x.nombre %></span><span class="subtitle"><%= x.proyecto.nombre %>, <%= x.modulo.nombre %></span></div><div class="action" rel="<%= x.id %>"><span class="pause">Pausa</span><span class="finish">Terminar</span></div></div><% }); %>';
	var compiled = _.template(templateHTML);
	var html = compiled({ tasksList : tasks});
	panel.port.emit('render',html);
}
// View Last Task
function viewLastTask(tasks){
	templateHTML = '<% _.each(tasksList,function(x){ %><div class="old"><div><span class="title"><%= x.nombre %></span><span class="subtitle"><%= x.proyecto.nombre %>, <%= x.modulo.nombre %></span></div><div rel="<%= x.id %>"><span class="play">Iniciar</span></div></div><% }); %>';
	var compiled = _.template(templateHTML);
	var html = compiled({ tasksList : tasks });
	panel.port.emit('renderOld',html);
}
// View Login
panel.port.on('login',function(){
	templateHTML = '<div class="login"><div>Identificate para poder comenzar</div><span class="btn" id="login"><%= value %></span></div>';
	var compiled = _.template(templateHTML);
	var html = compiled({ value: 'Login' });
	panel.port.emit('render',html);
});

// Open Tabs
panel.port.on('openTab',function(obj){
	if( typeof obj === 'object' ){
		var type = obj.name,
			link;
		if( obj.url ){
			link = obj.url;
		}else if( type == 'newTask' ){
			link = UrlSite + 'track/tarea/add/';
		}else{
			link = UrlSite;
		}
		tabs.open(link);
	}
});

// JSON request
panel.port.on('data',function(data){
	if( data.tasks.length > 0 ){
		viewTasks(data.tasks);
	}else{
		viewEmpty();
	}
	if( data.last_tasks.length > 0 ){
		viewLastTask(data.last_tasks);
	}
});

//panel.port.on('')
