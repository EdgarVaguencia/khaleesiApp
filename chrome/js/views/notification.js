var Backbone = require('backbone'),
		$ = require('jquery')
		Backbone.$ = $;

module.exports = Backbone.View.extend({

	el: $('body'),

	initialize : function(obj){
		if( obj.txt ){
			this.options.message = obj.txt;
		}
		if( obj.title ){
			this.options.title = obj.title;
		}
		this.view();
	},

	options : {
		type: "basic",
		title: "Khaleesi",
		message : '',
		iconUrl : '../img/keep.png',
	},

	view : function(){
		this.clear();
		chrome.notifications.create(this.cid,this.options,function(id){ console.log(chrome.runtime.lastError); });
	},

	clear : function(){
		chrome.notifications.getAll(function(ide){ _.each(ide,function(i,k){ chrome.notifications.clear(k,function(id){ console.log(chrome.runtime.lastError) }) }) });
	},

});
