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

	onRender : function(){
		var elapsedTime = 3600;
		if( _.find(JSON.parse(localStorage.khaleesiTime),{ cid : this.model.get('pkid') })){
			console.log('Ya hay uno');
			prevElapsedTime = _.findWhere(JSON.parse(localStorage.khaleesiTime),{ cid : this.model.get('pkid') });
			elapsedTime = prevElapsedTime.elapsed;
		}
		this.timer = new Timer({ duration : elapsedTime, cid : this.model.get('pkid') });
		this.trigger(this.viewTimer());
	},

	viewTimer : function(){
		this.$el.find('.timer').html(this.timer.minTime+':'+this.timer.secTime);
		var timeView = setTimeout(function(){this.viewTimer()}.bind(this),1000);
	},

	saveTime : function(){
		var self = this;
				localStorage.khaleesiTime.length > 0 ? tasklist = JSON.parse(localStorage.khaleesiTime) : tasklist = [];
		if( _.find(tasklist,{ cid : this.model.get('pkid') })){
			_.each(tasklist,function(k){
				if( k.cid == self.model.get('pkid')){
					k.elapsed = self.timer.endTime;
				}
			});
		}else{
			task = {
				cid : this.model.get('pkid'),
				elapsed : this.timer.endTime,
			}
			tasklist.push(task);
		}
		localStorage.khaleesiTime = JSON.stringify(tasklist);
	},

});
