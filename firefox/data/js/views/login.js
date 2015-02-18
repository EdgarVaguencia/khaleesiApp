var Backbone = require('backbone'),
	$ = require('jquery');

module.exports = Backbone.View.extend({

	el : $('#body'),

	events : {
		'click .btn' : 'openURL'
	},

	templateHTML : '<div class="login"><div>Identificate para poder comenzar</div><span class="btn">Login</span></div>',

	render : function(){
		this.$el.html(this.templateHTML);
	},

	openURL : function(){
		console.log(self.port.emit)
		self.port.emit('newTab',Backbone.app.url);
		//chrome.tabs.create({'url': Backbone.app.url });
	},

});
