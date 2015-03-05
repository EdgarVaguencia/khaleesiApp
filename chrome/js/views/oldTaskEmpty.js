var Backbone = require('backbone'),
	$ = require('jquery')
	Backbone.$ = $,
	Marionette = require('backbone.marionette'),
	_ = require('underscore');

module.exports = Marionette.ItemView.extend({

	template: _.template('<div class="login"><div>No tienes tareas previas</div><span class="btn">Crear nueva</span></div>'),

	events: {
		'click .btn' : 'open',
	},

	open: function(){
		var urlTasks = Backbone.app.url+'track/tarea/add/';
		chrome.tabs.create({ 'url': urlTasks });
	},

});
