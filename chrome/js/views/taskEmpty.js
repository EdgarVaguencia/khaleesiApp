var Backbone = require('backbone'),
	$ = require('jquery')
	Backbone.$ = $,
	Marionette = require('backbone.marionette'),
	_ = require('underscore');

module.exports = Marionette.ItemView.extend({

	template: _.template('<div class="login"><div>No tienes tareas iniciadas, accede al sistema para iniciar una y "A darle átomos"</div><span class="btn">Entrar</span></div>'),

	events: {
		'click .btn' : 'open',
	},

	open: function(){
		chrome.tabs.create({ 'url': 'http://khaleesi.unisem.mx/' });
	},

});
