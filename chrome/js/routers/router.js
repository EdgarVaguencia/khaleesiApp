var Backbone = require('backbone'),
	$ = require('jquery'),
	LoginView = require('../views/login');

module.exports = Backbone.Router.extend({

	routes :{
		'index.html' : 'resource',
		'' : 'resource',
	},

	initialize : function(){
		Backbone.history.start({ pushState : true });
	},

	resource : function(){
		var self = this;
		var url = '';
		var req = new XMLHttpRequest();
		req.open('GET',url,true);
		req.responseType = 'text';
		req.onload = function(){
			if (req.readyState === 4){
				if( req.response.substring(1,2) == '<' ){
					self.Login = new LoginView();
					self.Login.render();
				}else{
					var data = JSON.parse(req.response);
					self.data(data);
				}
			}
		}
		req.send(null);
	},

	data : function(resp){
		console.log(resp);
	},

});
