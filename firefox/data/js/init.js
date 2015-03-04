var UrlSite = "http://khaleesi.unisem.mx/admin/",
  spanSite = document.getElementById('site'),
  el = document.getElementById('body');

// Link title
if( spanSite ){
  spanSite.addEventListener('click',function(e){
    self.port.emit('openTab',{ name : 'site' });
  });
}

// Get info
self.port.on('resource',function(){
  getTasks();
});

// Render html
self.port.on('render',function(html){
  var selfInit = this;
  selfInit.el.innerHTML = html;
  listenEvents();
});

// get JSON
function getTasks(){
  var selfInit = this;
  var urlJson = selfInit.UrlSite+'json/board/';
  var req = new XMLHttpRequest();
  req.open('GET',urlJson,true);
  req.responseType = 'text';
  req.onload = function(){
    if ( req.readyState === 4 && req.status === 200 ){
      if( req.response.substring(0,1) == '<' ){
        self.port.emit('login');
      }else{
        var data = JSON.parse(req.response);
        self.port.emit('data', data);
      }
    }else if( req.readyState === 4 && req.status === 404 ){

    }
  }
  req.send(null);
}

// Send action of task
function sendAction(obj){
  if( typeof obj === 'object' ){
    var selfInit = this,
      idTask = obj.task,
      actionTask = obj.action;
    var urlSend = selfInit.UrlSite+'track/tarea/'+idTask+'/board/'+actionTask;
    var req = new XMLHttpRequest();
		req.open('GET',urlSend,true);
		req.onload = function(){
			if ( req.readyState === 4 && req.status === 200 ){
				selfInit.getTasks();
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
    btnPause = document.getElementsByClassName('pause');
  if( btnLogin ){
    btnLogin.addEventListener('click',function(e){
      self.port.emit('openTab',{ name : 'login' });
    });
  }
  if( btnNewTask ){
    btnNewTask.addEventListener('click',function(e){
      self.port.emit('openTab',{ name : 'newTask' });
    });
  }
  if( btnPause.length > 0 ){
    for(x=0;x<btnPause.length;x++){
      btnPause.item(x).addEventListener('click',function(e){
        sendAction({ 'action': 3, 'task' : e.target.parentNode.attributes.rel.value });
      });
    }
  }
}
