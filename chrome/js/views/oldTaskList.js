var Backbone = require('backbone'),
  $ = require('jquery')
  Backbone.$ = $;
var Marionette = require('backbone.marionette'),
  OldTaskItem = require('../views/oldtask'),
  OldTaskEmpty = require('../views/oldTaskEmpty');

module.exports = Marionette.CollectionView.extend({

  el : $('#last'),

  childView : OldTaskItem,

  emptyView : OldTaskEmpty,

  onBeforeRender : function(){
    this.$el.empty();
  },

});
