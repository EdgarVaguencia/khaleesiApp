var Backbone = require('backbone'),
	$ = require('jquery');

module.exports = Backbone.View.extend({

	el : $('#body'),

	events : {
		'click .btn' : 'openURL'
	},

	templateHTML : '<div><span class="btn">Login</span></div>',

	render : function(){
		this.$el.html(this.templateHTML);
	},

	openURL : function(){
		chrome.tabs.create({'url':'http://khaleesi.unisem.mx/'});
	},

});
