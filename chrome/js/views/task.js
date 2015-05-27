var Backbone = require('backbone'),
	$ = require('jquery')
	Backbone.$ = $;
var	Marionette = require('backbone.marionette'),
	_ = require('underscore'),
	Timer = require('../views/timer');

module.exports = Marionette.ItemView.extend({

	tagName: 'div',

	className: 'task',

	template: _.template('<div class="detail"><span class="title"><%= name %></span><span class="subtitle"><%= project %>, <%= module %></span></div><div class="timer"></div><div class="action"><span class="pause">Pausa</span><span class="finish">Terminar</span></div>'),

	events: {
		'click .pause' : 'pause',
		'click .finish' : 'finish',
	},

	pause: function(){
		this.timer.statusTask(this.model.get('pkid'),3);
		this.destroy();
	},

	finish: function(){
		this.timer.statusTask(this.model.get('pkid'),4);
		this.destroy();
	},

	send: function(idType){
		var self = this;
		var urlSend = Backbone.app.url+'track/tarea/'+this.model.get('pkid')+'/board/'+idType;
		var req = new XMLHttpRequest();
		req.open('GET',urlSend,true);
		req.onload = function(){
			if ( req.readyState === 4 && req.status === 200 ){
				self.timer.stop();
				self.destroy();
				Backbone.app.resource();
			}
		}
		req.send(null);
	},

	onRender : function(){
		this.timer = new Timer({ cid : this.model.get('pkid') });
		this.trigger(this.viewTimer());
	},

	viewTimer : function(){
		this.timer.getTime();
		this.$el.find('.timer').html(this.timer.minTime+':'+this.timer.secTime);
		var timeView = setTimeout(function(){this.viewTimer()}.bind(this),1000);
	},


});
