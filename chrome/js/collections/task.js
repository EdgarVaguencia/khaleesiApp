var Backbone = require('backbone'),
    TaskModel = require('../models/task'),
    _ = require('underscore');

module.exports = Backbone.Collection.extend({

    model : TaskModel,

    inStatus: function(status_id) {
        var taskClone = this.clone();
        var taskStatus = _.filter(taskClone.models, function (task) {
            return task.get('status') == status_id;
        });
        taskClone.reset(taskStatus);
        return taskClone;
    },

});
