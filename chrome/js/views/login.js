var Backbone = require('backbone'),
    $ = require('jquery');

module.exports = Backbone.View.extend({

    el : $('#body'),

    events : {
        'click .btn' : 'openURL'
    },

    templateHTML : '<div class="login"><div>Identificate para poder comenzar</div><span class="btn">Login</span></div>',

    render : function() {
        this.$el.html(this.templateHTML);
    },

    openURL : function() {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        }else {
            window.open(chrome.runtime.getURL('/options.html'));
        }
    },

});
