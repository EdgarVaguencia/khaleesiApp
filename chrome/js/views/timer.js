var Backbone = require('backbone'),
		$ = require('jquery');

module.exports = Backbone.View.extend({

	initialize : function(obj) {
		if( typeof obj == 'object' ){
			if( obj.duration > 0 && obj.cid ){
				this.startTime = 0;
				this.endTime = obj.duration;
				this.hrTime = 0;
				this.minTime = 0;
				this.secTime = 0;
				this.timer = setInterval(function(){this.start()}.bind(this),1000);
				this.mIde = obj.cid;
			}
		}
	},

	start : function(){
		if( this.startTime < this.endTime ){
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
			this.endTime -= 1;
			this.saveTime();
		}
	},

	stop : function(){
		clearTimeout(this.Timer);
		this._startTime = this.endTime = this.minTime = this.secTime = undefined;
	},

	saveTime : function(){
		var self = this;
				localStorage.khaleesiTime.length > 0 ? tasklist = JSON.parse(localStorage.khaleesiTime) : tasklist = [];
		if( _.find(tasklist,{ cid : self.mIde })){
			_.each(tasklist,function(k){
				if( k.cid == self.mIde ){
					k.elapsed = self.endTime;
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
	},

});
