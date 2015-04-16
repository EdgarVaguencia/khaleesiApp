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
				statusTask(i.cid,3);
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
		this.saveTime();
		this.mIde = undefined;
	},

	saveTime : function(){
		var self = this;
		localStorage.khaleesiTime.length > 0 ? tasklist = JSON.parse(localStorage.khaleesiTime) : tasklist = [];
		if( _.find(tasklist,{ cid : self.mIde })){
			_.each(tasklist,function(k){
				if( k.cid == self.mIde ){
					if( k.endTime !== 0 ){
						k.elapsed = self.endTime;
					}
				}
			});
		}else{
			task = {
				cid : self.mIde,
				elapsed : self.endTime,
			}
			tasklist.push(task);
		}
		localStorage.khaleesiTime = JSON.stringify(tasklist);
		this.removeSave();
	},

	removeSave : function(){
		var self = this;
		if( localStorage.khaleesiTime.length > 0 ){
			tasklist = JSON.parse(localStorage.khaleesiTime);
			_.each(tasklist,function(i){
				if( i && i.elapsed <= 0 ){
					tasklist.pop(i);
				}
			});
			localStorage.khaleesiTime = JSON.stringify(tasklist);
		}
	},

	statusTask : function(ide,type){
		var self = this;
		var urlSend = Backbone.app.url+'track/tarea/'+ide+'/board/'+type;
		var req = new XMLHttpRequest();
		req.open('GET',urlSend,true);
		req.onload = function(){
			if ( req.readyState === 4 && req.status === 200 ){
				pageBack = chrome.extension.getBackgroundPage();
				pageBack.backboneApp.app.timers[self.mIde].stop();
				self.stop();
				var ntf = new Ntf({ txt: 'Felicidades, mereces un descanzo' });
				Backbone.app.resource();
			}
		}
		req.send(null);
	}

});
