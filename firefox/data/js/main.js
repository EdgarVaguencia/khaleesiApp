var Backbone = require('backbone'),
	Router = require('./routers/router'),
	$ = require('jquery')
	Backbone.$ = $,
	UrlSite = "http://khaleesi.unisem.mx/admin/";

$(function(){
	 Backbone.app = new Router({ url: UrlSite });
	self.port.on('resource',function(){
		Backbone.app.resource();
	});
});
