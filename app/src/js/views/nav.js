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
    this.$el.find('#user').html(Khaleesi.app.sync.get('first_name'));
  },
});
