var Backbone = require('backbone'),
        $ = require('jquery'),
        Ntf = require('../views/notification'),
        Task = require('../views/task'),
        _ = require('underscore');

module.exports = Backbone.View.extend({

    initialize : function(obj) {
        this.startTime = this.endTime = this.hrTime = this.minTime = this.secTime = 0;
        if( typeof obj == 'object' ){
            if( obj.duration > 0 && obj.cid ){
                this.endTime = obj.duration;
                this.mIde = obj.cid;
                this.timer = setInterval(function(){this.start()}.bind(this),1000);
            }else{
                if( obj.cid ){
                    this.mIde = obj.cid;
                }
                this.stop();
            }
        }
    },

    start : function(){
        if( this.startTime <= this.endTime ){
            diff = this.endTime - this.startTime;
            min = Math.floor(diff/60);
            sec = diff - (min*60);
            if( min < 10 ){
                this.minTime = "0" + min;
            }else{
                this.minTime = min;
            }
            if( sec < 10 ){
                this.secTime = "0" + sec;
            }else{
                this.secTime = sec;
            }
            if( diff == 0 ){
                this.statusTask(this.mIde,3);
                //this.stop();
            }else{
                this.endTime -= 1;
                this.saveTime();
            }
            if( this.sec == 30 ){
                var ntf = new Ntf({ txt: 'Ánimo, solo te restan 30sec para finalizar con esta actividad y poder tomar un descanzo' });
            }
        }
    },

    stop : function(){
        if( this.timer ){
            clearInterval(this.timer);
        }
        this.startTime = this.endTime = this.minTime = this.secTime = 0;
        // this.saveTime();
        this.mIde = undefined;
    },

    saveTime : function(){
        // var self = this;
        // newTask = false;
        // localStorage.khaleesiTime.length > 0 ? tasklist = JSON.parse(localStorage.khaleesiTime) : tasklist = [];
        // if( _.find(tasklist,{ cid : self.mIde })){
        //  _.each(tasklist,function(k){
        //      if( k.cid == self.mIde ){
        //          if( k.endTime !== 0 ){
        //              k.elapsed = self.endTime;
        //          }
        //      }
        //  });
        // }else{
        //  newTask = true;
        //  task = {
        //      cid : self.mIde,
        //      elapsed : self.endTime,
        //  }
        //  tasklist.push(task);
        // }
        // localStorage.khaleesiTime = JSON.stringify(tasklist);
        // if( newTask ){
        //  pageBack = chrome.extension.getBackgroundPage();
        //  pageBack.backboneApp.app.timer();
        //  newTask = false;
        // }
        // this.removeSave();
    },

    removeSave : function() {
        // var self = this;
        // if( localStorage.khaleesiTime.length > 0 ){
        //  tasklist = JSON.parse(localStorage.khaleesiTime);
        //  _.each(tasklist,function(i){
        //      if( i && i.elapsed <= 0 ){
        //          tasklist.pop(i);
        //      }
        //  });
        //  localStorage.khaleesiTime = JSON.stringify(tasklist);
        // }
    },

    getTime : function(){
        var self = this;
        localStorage.khaleesiTime.length > 0 ? tasklist = JSON.parse(localStorage.khaleesiTime) : tasklist = [];
        if( _.find(tasklist,{ cid : self.mIde }) ){
            _.each(tasklist,function(k){
                if( k.cid == self.mIde ){
                    self.minTime = Math.floor(k.elapsed/60);
                    self.secTime = k.elapsed - (self.minTime*60);
                }
            });
        }
    },

    statusTask : function(ide, type) {
        var self = this;
        var urlSend = Backbone.app.url+'pizarron/?username=' + Backbone.app.username + '&api_key=' + Backbone.app.apikey;
        var user = Backbone.app.User.model;
        var params = JSON.stringify({
            created_by: '/api/v1/user/' + user.get('ide') + '/',
            status: type,
            tarea: '/api/v1/tarea/' + ide + '/',
        });
        var req = new XMLHttpRequest();
        req.open('POST',urlSend,true);
        req.setRequestHeader("Content-type", "application/json");
        req.onload = function(){
            if ( req.readyState === 4 && req.status === 201 ){
                // pageBack = chrome.extension.getBackgroundPage();
                // pageBack.backboneApp.app.timers[self.mIde].stop();
                self.stop();
                var ntf = new Ntf({ txt: 'Felicidades, mereces un descanzo' });
                Backbone.app.resource();
            }
        }
        req.send(params);
    },

});
