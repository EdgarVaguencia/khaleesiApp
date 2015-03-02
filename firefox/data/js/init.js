var UrlSite = "http://khaleesi.unisem.mx/admin/",
  el = document.getElementById('body');

// Get info
self.port.on('resource',function(){
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
});

// Render html
self.port.on('render',function(html){
  var selfInit = this;
  selfInit.el.innerHTML = html;
  listenEvents();
});

// On click
function listenEvents(){
  var selfInit = this,
    btnLogin = document.getElementById('login'),
    btnNewTask = document.getElementById('newTask');
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
}
