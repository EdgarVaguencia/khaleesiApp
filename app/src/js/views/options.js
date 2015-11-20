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
