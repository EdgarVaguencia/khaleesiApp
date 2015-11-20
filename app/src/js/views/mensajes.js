'use strict';

Khaleesi.Views.Mensajes = Backbone.View.extend({
  el: jQuery('body'),

  template: _.template('<div class="alert" id="msj_system" role="alert" style="display: none; position: fixed; text-align: center; top: 0; width: 100%; z-index: 1024;"><span id="msjTxt"><%= txt %></span></div>'),

  render: function(_txt) {
    this.$el.append(this.template({txt: _txt}));
    jQuery('#msj_system').fadeIn(1400).delay(1600).fadeOut(1400, function() {
      jQuery(this).detach();
    });
  },
});
