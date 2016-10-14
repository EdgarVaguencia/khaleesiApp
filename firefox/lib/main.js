var { ToggleButton } = require('sdk/ui/button/toggle'),
    self = require("sdk/self"),
    panels = require("sdk/panel"),
    tabs = require("sdk/tabs"),
    _ = require('underscore'),
    ss = require("sdk/simple-storage"),
    UrlSite = "http://khaleesi.unisem.mx/admin/",
    UrlApi = "http://khaleesi.unisem.mx/api/v1/";

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
    width: 400,
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
        if (ss.storage.userName !== undefined) {
            panel.port.emit('resource', JSON.stringify({user: ss.storage.userName, api: ss.storage.apiKey, ide: ss.storage.userId}));
        }else {
            panel.port.emit('resource');
        }
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

// View Empty Task
function viewEmpty() {
    var html = '<div class="login"><div>No tienes tareas iniciadas, accede al sistema para iniciar una y "A darle átomos"</div><span class="btn" id="newTask">Crear nueva</span></div>';
    panel.port.emit('render', html);
}

// View Tasks
function viewTasks(tasks) {
    templateHTML = '<% _.each(tasksList, function(x){ %><div class="task"><div class="detail"><span class="title"><%= x.id %> - <%= x.nombre %></span><span class="subtitle"><%= x.horas_reales %> de <%= x.horas_estimadas %> hrs.</span></div><div class="action" rel="<%= x.id %>"><span class="pause">Pausa</span><span class="finish">Terminar</span></div></div><% }); %>';
    var compiled = _.template(templateHTML);
    var html = compiled({ tasksList : tasks});
    panel.port.emit('render',html);
}
// View Last Task
function viewLastTask(tasks) {
    templateHTML = '<% _.each(tasksList,function(x){ %><div class="old"><div><span class="title"><%= x.id %> - <%= x.nombre %></span><span class="subtitle"><%= x.horas_reales %> hrs.</span></div><div rel="<%= x.id %>"><span class="play">Iniciar</span></div></div><% }); %>';
    var compiled = _.template(templateHTML);
    var html = compiled({ tasksList : tasks });
    panel.port.emit('renderOld',html);
}
// View Login
panel.port.on('login',function() {
    // templateHTML = '<div class="login"><div>Identificate para poder comenzar</div><span class="btn" id="login"><%= value %></span></div>';
    templateHTML = '<section id="bodyOpt"><input type="text" id="username" name="khaleesiUser" placeholder="Khaleesi Username" value="<%= user %>"><input type="text" id="apikey" name="khaleesiApi" placeholder="Khaleesi Api Key" value="<%= api %>"><div id="features"><span id="message"></span><span class="btn" id="test">Login</span></div><div id="result"></div></section>';
    var user = ss.storage.userName !== undefined ? ss.storage.userName : '';
    var api = ss.storage.apiKey !== undefined ? ss.storage.apiKey : '';
    var compiled = _.template(templateHTML);
    var html = compiled({ user: user, api: api });
    panel.port.emit('render', html);
});

// Open Tabs
panel.port.on('openTab', function(obj) {
    if ( typeof obj === 'object' ) {
        var type = obj.name,
            link;
        if( obj.url ){
            link = obj.url;
        }else if ( type == 'newTask' ) {
            link = UrlSite + 'track/tarea/add/';
        }else if ( type == 'login' ){
            link = self.data.url('options.html');
        }else{
            link = UrlSite;
        }
        tabs.open(link);
    }
});

// JSON request
panel.port.on('data', function(data) {
    if( data.objects.length > 0 ){
        _.each(data.objects, function(t) { t.horas_reales = Math.round(t.horas_reales * 100) / 100; });
        var activeTask = _.filter(data.objects, function(t) { return t.pizarron_status == 2 });
        var pausedTask = _.filter(data.objects, function(t) { return t.pizarron_status == 3 });
        if (activeTask.length > 0) {
            viewTasks(activeTask);
        }else {
            viewEmpty();
        }
        viewLastTask(pausedTask);
    }else{
        viewEmpty();
    }
});

panel.port.on('save', function(data) {
    ss.storage.userName = data.username;
    ss.storage.apiKey = data.apikey;
    ss.storage.userId = data.userid;
    console.info('Info Saved: ' + ss.storage.userName);
    panel.port.emit('resource', JSON.stringify({user: ss.storage.userName, api: ss.storage.apiKey, ide: ss.storage.userId}));
});

