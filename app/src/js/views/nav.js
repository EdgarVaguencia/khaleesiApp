/**
 * 
 */
'use strict';
Khaleesi.Views.Dashboard = Backbone.View.extend({
  el: jQuery('.nav'),

  events: {
    'click .task': 'taskView',
    'click .setting': 'optionView'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.userView, this);
  },

  taskView: function(e){
    this.$el.find('a.active').removeClass('active');
    jQuery(e.target).parent().addClass('active');
    Khaleesi.app.navigate('', {trigger: true});
  },

  optionView: function(e){
    this.$el.find('a.active').removeClass('active');
    jQuery(e.target).parent().addClass('active');
    Khaleesi.app.navigate('settings/', {trigger: true});
  },

  userView: function() {
    this.$el.find('#user').html(this.model.get('first_name'));
  },
});
