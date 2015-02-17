var Backbone = require('backbone'),
	TaskModel = require('../models/task');

module.exports = Backbone.Collection.extend({

	model : TaskModel,

});
