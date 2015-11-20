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
