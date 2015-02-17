var Backbone = require('backbone'),
	$ = require('jquery')
	Backbone.$ =$;
var	Marionette = require('backbone.marionette'),
	TaskItem = require('../views/task'),
	TaskEmpty = require('../views/taskEmpty');

module.exports = Marionette.CollectionView.extend({

	el: $('#body'),

	childView: TaskItem,

	emptyView: TaskEmpty,

	onBeforeRender: function(){
		this.$el.empty();
	},

});
