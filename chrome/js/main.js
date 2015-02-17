var Backbone = require('backbone'),
	Router = require('./routers/router'),
	$ = require('jquery')
	Backbone.$ = $,
	UrlSite = 'http://localhost:8000/admin/' ;//"http://khaleesi.unisem.mx/admin/";

$(function(){
	 Backbone.app = new Router({ url: UrlSite });
});
