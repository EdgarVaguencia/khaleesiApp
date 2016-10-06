var Backbone = require('backbone'),
  $ = require('jquery')
  Backbone.$ = $;
var Marionette = require('backbone.marionette'),
  _ = require('underscore');

module.exports = Marionette.ItemView.extend({

  tagName : 'div',

  className : 'old',

  template : _.template('<div><span class="title"><label><%= pkid %></label> - <%= name %></span><span class="subtitle"><%= reales %> hrs.</span></div><div><span class="play">Iniciar</span></div>'),

  events : {
    'click .play' : 'play'
  },

  play : function(){
    this.send(2);
  },

  send : function(idType){
    var self = this;
    var urlSend = Backbone.app.url+'pizarron/?username=' + Backbone.app.username + '&api_key=' + Backbone.app.apikey
    var user = Backbone.app.User.model;
    var params = JSON.stringify({
      created_by: '/api/v1/user/' + user.get('ide') + '/',
      status: idType,
      tarea: self.model.get('url'),
    });
    var req = new XMLHttpRequest();
    req.open('POST', urlSend, true);
    req.setRequestHeader("Content-type", "application/json");
    req.onload = function(){
      if ( req.readyState === 4 && req.status === 201 ){
        // self.addTimer();
        self.destroy();
        Backbone.app.resource();
      }
    }
    req.send(params);
  },

  addTimer : function(){
    // localStorage.khaleesiTime.length > 0 ? tasklist = JSON.parse(localStorage.khaleesiTime) : tasklist = [];
    // var task = {
    //   cid : this.model.get('pkid'),
    //   elapsed : 3600,
    // }
    // tasklist.push(task);
    // localStorage.khaleesiTime = JSON.stringify(tasklist);
    // pageBack = chrome.extension.getBackgroundPage();
    // pageBack.backboneApp.app.timer();
  },

});
