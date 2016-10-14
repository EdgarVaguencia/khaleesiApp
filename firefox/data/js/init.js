var UrlSite = "http://khaleesi.unisem.mx/admin/",
  UrlApi = "http://khaleesi.unisem.mx/api/v1/",
  spanSite = document.getElementById('site'),
  el = document.getElementById('body'),
  elOld = document.getElementById('last');

// Link title
if( spanSite ){
  spanSite.addEventListener('click',function(e){
    self.port.emit('openTab',{ name : 'site' });
  });
}

// Get info
self.port.on('resource', function(data) {
  var selfInit = this;
  if (data !== undefined) {
    data = JSON.parse(data);
    selfInit.user = data.user;
    selfInit.api = data.api;
    selfInit.ide = data.ide;
    getTasks();
  }else{
    self.port.emit('login');
  }
});

// Render html
self.port.on('render',function(html) {
  var selfInit = this;
  selfInit.el.innerHTML = html;
  listenEvents();
});
// Render html old Taks
self.port.on('renderOld',function(html) {
  var selfInit = this;
  selfInit.elOld.innerHTML = html;
  listenEvents();
});

// get JSON
function getTasks() {
  var selfInit = this;
  var urlJson = selfInit.UrlApi + 'tarea/?username=' + selfInit.user + '&api_key=' + selfInit.api + '&format=json&limit=100';
  var req = new XMLHttpRequest();
  req.open('GET', urlJson, true);
  req.onload = function(){
    if (req.readyState === 4 && req.status === 200) {
      var data = JSON.parse(req.response);
      self.port.emit('data', data);
    }else if( req.readyState === 4 && req.status === 404 ){
      console.info('Error task:')
    }
  }
  req.send(null);
}

// Send action of task
function sendAction(obj){
  if (typeof obj === 'object') {
    var selfInit = this,
      idTask = obj.task,
      actionTask = obj.action;
    var urlSend = selfInit.UrlApi+'pizarron/?username=' + selfInit.user + '&api_key=' + selfInit.api;
    var params = JSON.stringify({
      created_by: '/api/v1/user/' + selfInit.ide + '/',
      status: actionTask,
      tarea: '/api/v1/tarea/' + idTask + '/' 
    });
    var req = new XMLHttpRequest();
    req.open('POST', urlSend, true);
     req.setRequestHeader("Content-type", "application/json");
    req.onload = function(){
      if ( req.readyState === 4 && req.status === 201 ){
        selfInit.getTasks();
      }
    }
    req.send(params);
  }
}

// Get User info
function getUser(obj) {
  if (typeof obj === 'object') {
    var selfInit = this;
    var urlSend = 'http://khaleesi.unisem.mx/api/v1/user/?username=' + obj.username + '&api_key=' + obj.apikey + '&format=json';
    var req = new XMLHttpRequest();
    req.open('GET', urlSend, true);
    req.setRequestHeader('Content-type', 'application/json');
    req.onload = function() {
      if (req.readyState === 4 && req.status === 200) {
        var data = JSON.parse(req.response);
        var result = document.getElementById('result');
        var data = data.objects[0];
        result.append(data.first_name + ' - ' + data.last_name);
        obj.userid = data.id;
        self.port.emit('save', obj);
      }
    }
    req.send(null);
  }
}

// On click
function listenEvents(){
  var selfInit = this,
    btnLogin = document.getElementById('login'),
    btnNewTask = document.getElementById('newTask'),
    btnPause = document.getElementsByClassName('pause'),
    btnPlay = document.getElementsByClassName('play')
    btnTest = document.getElementById('test'),
    txtUsername = document.getElementById('username'),
    txtApiKey = document.getElementById('apikey');
  if (btnLogin) {
    removeClick(btnLogin);
    btnLogin.addEventListener('click', function(e) {
      self.port.emit('openTab',{ name : 'login' });
    });
  }
  if (btnNewTask) {
    removeClick(btnNewTask);
    btnNewTask.addEventListener('click', function(e) {
      self.port.emit('openTab',{ name : 'newTask' });
    });
  }
  if (btnPause.length > 0) {
    for(x=0;x<btnPause.length;x++){
      removeClick(btnPause.item(x));
      btnPause.item(x).addEventListener('click', function(e) {
        sendAction({ 'action': 3, 'task' : e.target.parentNode.attributes.rel.value });
      });
    }
  }
  if (btnPlay.length > 0) {
    for( x=0;x<btnPlay.length;x++ ){
      removeClick(btnPlay.item(x));
      btnPlay.item(x).addEventListener('click',function(e){
        sendAction({ 'action': 2, 'task': e.target.parentNode.attributes.rel.value });
      });
    }
  }
  if (btnTest) {
    removeClick(btnTest);
    btnTest.addEventListener('click', function(e) {
      getUser({username: username.value, apikey: apikey.value})
    });
  }
}

// Off click
function removeClick(elem) {
  elem.removeEventListener('click', function(e) {
    e.preventDefault();
  });
}
