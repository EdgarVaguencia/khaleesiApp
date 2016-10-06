var Backbone = require('backbone'),
    $ = require('jquery')
    Backbone.$ = $;
var Marionette = require('backbone.marionette'),
    _ = require('underscore'),
    Timer = require('../views/timer');

module.exports = Marionette.ItemView.extend({

    tagName: 'div',

    className: 'task',

    template: _.template('<div class="detail"><span class="title"><%= name %></span><span class="subtitle"><%= reales %> de <%= estimadas %> hrs.</span></div><div class="timer"></div><div class="action"><span class="pause">Pausa</span><span class="finish">Terminar</span></div>'),

    events: {
        'click .pause' : 'pause',
        'click .finish' : 'finish',
    },

    pause: function(){
        this.timer.statusTask(this.model.get('pkid'),3);
        this.destroy();
        //this.send(3);
    },

    finish: function(){
        this.timer.statusTask(this.model.get('pkid'), 4);
        this.destroy();
        //this.send(4);
    },

    send: function(idType){
        // var self = this;
        // var urlSend = Backbone.app.url+'track/tarea/'+this.model.get('pkid')+'/board/'+idType;
        // var req = new XMLHttpRequest();
        // req.open('GET',urlSend,true);
        // req.onload = function(){
        //     if ( req.readyState === 4 && req.status === 200 ){
        //         self.timer.stop();
        //         self.destroy();
        //         Backbone.app.resource();
        //     }
        // }
        // req.send(null);
    },

    onRender : function(){
     // var elapsedTime = 3600;
     // localStorage.khaleesiTime.length > 0 ? tasklist = JSON.parse(localStorage.khaleesiTime) : tasklist = [];
     // if( _.find(tasklist,{ cid : this.model.get('pkid') })){
     //     prevElapsedTime = _.findWhere(JSON.parse(localStorage.khaleesiTime),{ cid : this.model.get('pkid') });
     //     elapsedTime = prevElapsedTime.elapsed;
     //     //this.timer = Backbone.app.timer[this.model.get('pkid')];
     //     //console.log(this.timer);
     //     //this.trigger(this.viewTimer());
     // }
     this.timer = new Timer({ /*duration : elapsedTime,*/ cid : this.model.get('pkid') });
     // this.trigger(this.viewTimer());
    },

    viewTimer : function(){
        this.$el.find('.timer').html(this.timer.minTime + ':' + this.timer.secTime);
        var timeView = setTimeout(function(){this.viewTimer()}.bind(this), 1000);
    },


});
