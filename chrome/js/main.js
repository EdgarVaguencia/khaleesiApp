var Backbone = require('backbone'),
    Router = require('./routers/router'),
    $ = require('jquery')
    Backbone.$ = $,
    UrlSite = 'http://khaleesi.unisem.mx/api/v1/';

$(function(){
     Backbone.app = new Router({ url: UrlSite});
});
