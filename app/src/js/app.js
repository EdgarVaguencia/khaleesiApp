'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var jQuery = require('jquery');
var jsonfile = require('jsonfile');
var util = require('util');
var Khaleesi = {
  Models: {},
  Collections: {},
  Views: {},
  Router: {},
  Options: {
    urlBase: 'http://localhost:8000' ,//'http://khaleesi.unisem.mx',
    urlBoard: '/api/v1/pizarron/',
    urlTarea: '/api/v1/tarea/',
    urlUser: '/api/v1/user/',
    urlDataJson: '?format=json'
  }
};

window.Khaleesi = Khaleesi;

/**
 * 
 */
'use strict';
Khaleesi.Models.Sync = Backbone.Model.extend({

   defaults: {
    'user': '',
    'token': '',
    'first_name': '',
    'last_name': '',
    'ide': '',
    'resource': ''
   },

  initialize: function() {
    this.listenTo(this, 'change', this.writeFile);
    this.readData();
  },

  datafile: __dirname + '/data.json',

  readData: function() {
    const self = this;
    var _obj = jsonfile.readFileSync(this.datafile);
    if (_obj !== null) {
      self.set({'user': _obj.user, 'token': _obj.token});
    }
  },

  writeFile: function() {
    const self = this;
    var param = {
      token: this.get('token'),
      user: this.get('user'),
      first_name: this.get('first_name'),
      last_name: this.get('last_name'),
      ide: this.get('ide'),
      resource: this.get('resource')
    }
    jsonfile.writeFile(self.datafile, param, function (err) {
      if (err !== null) {
        console.error(err);
      }
    });
  }
});

/**
 * 
 */
'use strict';
Khaleesi.Models.Tarea = Backbone.Model.extend({});

/**
 * 
 */
'use strict';

Khaleesi.Collections.Tareas = Backbone.Collection.extend({
  model: Khaleesi.Models.Tarea
});

/**
 * 
 */
'use strict';
Khaleesi.Views.List = Backbone.View.extend({
  className: 'pane',

  events: {
    'drop': 'droped',
  },

  template: _.template('<h4>Tareas <%= title %></h4><ul class="list-group list-content"></ul>'),

  tareaTemplate: _.template('<span class="pull-left icon icon-layout"></span><div class="media-body"><span><%= name %></span>, <span><%= description %></span></div>'),

  initialize: function(obj){
    this.listenTo(this.collection, 'add', this.addTarea, this);
    this.listenTo(this.collection, 'remove', this.update, this);
    this.title = obj !== undefined ? obj.title : '';
    this._status = obj !== undefined ? obj._status: 0;
  },

  render: function() {
    this.$el.empty();
    this.$el.html(this.template({title: this.title}));
    return this;
  },

  addTarea: function(tarea) {
    var item = jQuery('<li/>',{
      'class': 'list-group-item droptask',
      'data-ide': tarea.get('ide')
    }).append(this.tareaTemplate(tarea.toJSON()));
    this.$el.find('ul').append(item);
    item.draggable({
      revert: 'invalid',
      // containment: '.window-body',
      helper: 'clone'
    });
  },

  droped: function(e, ui) {
    var ide = ui.draggable.data('ide')
    var tarea = Khaleesi.app.tareas.findWhere({'ide': ide});
    tarea.set({'status': this._status});
    ui.draggable.remove();
  },

  update: function() {
    this.collection.forEach(this.addTarea, this);
  }

});

'use strict';

Khaleesi.Views.Mensajes = Backbone.View.extend({
  el: jQuery('body'),

  template: _.template('<div class="alert" id="msj_system" role="alert" style="display: none; position: fixed; text-align: center; top: 0; width: 100%; z-index: 1024;"><span id="msjTxt"><%= txt %></span></div>'),

  render: function(_txt) {
    this.$el.append(this.template({txt: _txt}));
    jQuery('#msj_system').fadeIn(1400).delay(1600).fadeOut(1400, function() {
      jQuery(this).detach();
    });
  },
});

/**
 * 
 */
'use strict';
Khaleesi.Views.Dashboard = Backbone.View.extend({
  el: jQuery('.nav'),

  events: {
    'click .task': 'taskView',
    'click .setting': 'optionView'
  },

  taskView: function(e){
    this.$el.find('a.active').removeClass('active');
    jQuery(e.target).parent().addClass('active');
    Khaleesi.app.navigate('', {trigger: true});
  },

  optionView: function(e){
    this.$el.find('a.active').removeClass('active');
    jQuery(e.target).parent().addClass('active');
    Khaleesi.app.navigate('settings/', {trigger: true});
  },

  userView: function() {
    this.$el.find('#user').html(Khaleesi.app.sync.get('first_name'));
  },
});

/**
 * 
 */
'use strict'

Khaleesi.Views.Options = Backbone.View.extend({
  el: jQuery('.window-body'),

  events: {
    'change #user': 'saveUser',
    'change #token': 'saveToken'
  },

  template: _.template('<div class="pane"><form><div class="form-group"><label for="">Nombre de usuario</label><input type="text" class="form-control" placeholder="Username" value="<%= user %>" id="user" /></div><div class="form-group"><label for="">Api key</label><input type="text" class="form-control" placeholder="Token" value="<%= token %>" id="token" /></div></form></div>'),

  render: function() {
    var _data = Khaleesi.app.sync.toJSON();
    this.$el.html(this.template(_data));
  },

  saveUser: function(e) {
    if (e.target !== undefined && e.target.value.length > 0) {
      Khaleesi.app.sync.set('user', e.target.value);
      Khaleesi.app.msj.render('Guardado');
    }
  },

  saveToken: function(e) {
    if (e.target !== undefined && e.target.value.length > 0) {
      Khaleesi.app.sync.set('token', e.target.value);
      Khaleesi.app.msj.render('Guardado');
    }
  },

});

/**
 * 
 */
'use strict';
Khaleesi.Views.Tareas = Backbone.View.extend({
  el: jQuery('.window-body'),

  initialize: function() {
    this.listenTo(this.collection, 'add', this.addTarea, this);
    this.listenTo(this.collection, 'change', this.changeTarea, this);
    this.pendientes = new Khaleesi.Collections.Tareas();
    this.proceso = new Khaleesi.Collections.Tareas();
    this.pausadas = new Khaleesi.Collections.Tareas();
    this.terminadas = new Khaleesi.Collections.Tareas();
    this.bloqueadas = new Khaleesi.Collections.Tareas();
    this.listPendientes = new Khaleesi.Views.List({title: 'pendientes', collection: this.pendientes, _status: 0});
    this.listProceso = new Khaleesi.Views.List({title: 'en proceso', collection: this.proceso, _status: 2});
    this.listPausadas = new Khaleesi.Views.List({title: 'pausadas', collection: this.pausadas, _status: 3});
    this.listTerminadas = new Khaleesi.Views.List({title: 'terminadas', collection: this.terminadas, _status: 4});
    this.listBloqueadas = new Khaleesi.Views.List({title: 'terminadas', collection: this.bloqueadas, _status: 5});
  },

  render: function(){
    this.$el.html('').append(this.listPendientes.render().el, this.listProceso.render().el, this.listPausadas.render().el, this.listTerminadas.render().el);
    this.$el.find('ul.list-group').droppable({
      accept: 'li.droptask',
      hoverClass: 'highlight'
      });
    this.collection.forEach(this.addTarea, this);
  },

  addTarea: function(tarea) {
    const self = this;
    if (tarea.get('status') < 2) {
      self.pendientes.add(tarea);
    }else if (tarea.get('status') === 2) {
      self.proceso.add(tarea);
    }else if (tarea.get('status') === 3) {
      self.pausadas.add(tarea);
    }else if (tarea.get('status') === 4) {
      self.terminadas.add(tarea);
    }else if (tarea.get('status') === 5) {
      self.bloqueadas.add(tarea);
    }
  },

  changeTarea: function(tarea) {
    this.removeList(tarea.previous('status'), tarea);
    this.addList(tarea.get('status'), tarea);
  },

  removeList: function(status, tarea) {
    if (status === 0) {
      this.pendientes.remove(tarea);
    }else if (status === 2) {
      this.proceso.remove(tarea);
    }else if (status === 3) {
      this.pausadas.remove(tarea);
    }else if (status === 4) {
      this.terminadas.remove(tarea);
    }else if (status === 5) {
      this.bloqueadas.remove(tarea);
    }
  },

  addList: function(status, tarea) {
    var response = Khaleesi.app.request({
      url: Khaleesi.Options.urlBase + Khaleesi.Options.urlBoard,
      method: 'POST',
      data: [{
        'tarea': tarea.get('resource'),
        'status': status,
        'created_by': Khaleesi.app.sync.get('resource')
        }]
      });
    if (response !== null) {
      response.done(function(data) {
        console.log(data);
      });
    }
    if (status === 0) {
      this.pendientes.add(tarea);
    }else if (status === 2) {
      this.proceso.add(tarea);
    }else if (status === 3) {
      this.pausadas.add(tarea);
    }else if (status === 4) {
      this.terminadas.add(tarea);
    }else if (status === 5) {
      this.bloqueadas.add(tarea);
    }
  },
});

/**
 * 
 */
'use strict';

Khaleesi.Router = Backbone.Router.extend({
  routes: {
    '': 'tasks',
    'settings/': 'options'
  },

  initialize: function() {
    this.sync = new Khaleesi.Models.Sync();
    this.tareas = new Khaleesi.Collections.Tareas();
    this.nav = new Khaleesi.Views.Dashboard();
    this.listTareas = new Khaleesi.Views.Tareas({collection: this.tareas});
    this.configurations = new Khaleesi.Views.Options();
    this.msj = new Khaleesi.Views.Mensajes();
    this.userView();
    Backbone.history.start();
  },

  userView: function() {
    if (this.sync.get('token').length > 0 && this.sync.get('user').length > 0) {
      this.fetchUser();
    }
  },

  tasks: function() {
    if (this.sync.get('token').length > 0 && this.sync.get('user').length > 0) {
      this.listTareas.render();
      this.fetchTareas();
    }
  },

  request: function(_obj) {
    var _url = _obj.url;// + '&api_key=' + this.sync.get('token') + '&username=' + this.sync.get('user');
    var _data = _obj.data !== undefined ? JSON.stringify(_obj.data[0]) : '';
    var _method = _obj.method !== undefined ? _obj.method : 'get';
    return Backbone.ajax({
      headers : {
        'Authorization': 'ApiKey ' + this.sync.get('user') + ':' + this.sync.get('token')
      },
      contentType: 'application/json',
      // dataType: 'json',
      processData: false,
      url: _url,
      method: _method,
      data: _data
    });
  },

  fetchTareas: function() {
    const self = this;
    var response = this.request({url: Khaleesi.Options.urlBase + '/api/v1/tarea/' + Khaleesi.Options.urlDataJson});
    if (response !== null) {
      response.done(function(data) {
        if (data.meta.total_count > 0) {
          _.each(data.objects, function(item) {
            var tarea = new Khaleesi.Models.Tarea({
                description: item.descripcion,
                end: item.fecha_final,
                hours: item.horas_estimadas,
                ide: item.id,
                name: item.nombre,
                resource: item.resource_uri,
                status: item.status
              });
            self.tareas.add(tarea);
          });
        }
      });
    }
    // this.tareas.render();
  },

  fetchUser: function() {
    const self = this;
    var response = this.request({url: Khaleesi.Options.urlBase + Khaleesi.Options.urlUser + Khaleesi.Options.urlDataJson});
    if (response !== null) {
      response.done(function(data) {
         var user = data.objects[0];
         self.sync.set('first_name', user.first_name);
         self.sync.set('last_name', user.last_name);
         self.sync.set('ide', user.id);
         self.sync.set('resource', user.resource_uri);
      });
    };
  },

  options: function() {
    this.configurations.render();
  }
});

'use strict';

jQuery(function() {
  Khaleesi.app = new Khaleesi.Router();
});
