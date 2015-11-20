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
