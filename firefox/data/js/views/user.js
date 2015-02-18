var Backbone = require('backbone'),
	$ = require('jquery');

module.exports = Backbone.View.extend({

	el : $('header'),

	events: {
		'click .title' : 'site',
	},

	displayUser : function(){
		this.$el.find('.userMenu').html(this.model.get('username'));
	},

	site: function(){
		chrome.tabs.create({ url: Backbone.app.url });
	}

});
