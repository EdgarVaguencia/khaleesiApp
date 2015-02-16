var Backbone = require('backbone'),
	$ = require('jquery');

module.exports = Backbone.View.extend({

	el : $('header'),

	displayUser : function(){
		this.$el.find('.userMenu').html(this.model.get('username'));
	},

});
