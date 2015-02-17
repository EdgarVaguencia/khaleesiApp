var Backbone = require('backbone'),
	$ = require('jquery')
	Backbone.$ = $;
var	Marionette = require('backbone.marionette'),
	_ = require('underscore');

module.exports = Marionette.ItemView.extend({

	tagName: 'div',

	className: 'task',

	template: _.template('<div class="detail"><span class="title"><%= name %></span><span class="subtitle"><%= project %>, <%= module %></span></div><div class="action"><span class="pause">Pausa</span><span class="finish">Terminar</span></div>'),

	events: {
		'click .pause' : 'pause',
		'click .finish' : 'finish',
	},

	pause: function(){
		this.send(3);
	},

	finish: function(){
		this.send(4);
	},

	send: function(idType){
		var self = this;
		var urlSend = Backbone.app.url+'track/tarea/'+this.model.get('pkid')+'/board/'+idType;
		var req = new XMLHttpRequest();
		req.open('GET',urlSend,true);
		req.onload = function(){
			if ( req.readyState === 4 && req.status === 200 ){
				self.destroy();
				Backbone.app.resource();
			}
		}
		req.send(null);
	},

});
