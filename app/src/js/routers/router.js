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
