var Backbone = require('backbone'),
	$ = require('jquery'),
	LoginView = require('../views/login'),
	UserView = require('../views/user'),
	TaskView = require('../views/taskList'),
	OldTaskView = require('../views/oldTaskList'),
	//ClockView = require('../views/clock'),
	TaskCollection = require('../collections/task'),
	UserModel = require('../models/user'),
	TaskModel = require('../models/task');

module.exports = Backbone.Router.extend({

	routes :{
		// '_generated_background_page.html' : 'timer',
		'index.html' : 'resource',
	},

	initialize : function(obj){
		if( typeof obj === 'object' ){
			this.url = obj.url;
		}
		Backbone.history.start({ pushState : true });
		//this.now = new Date;
	},

	resource : function(){
		var self = this;
		var urlJson = this.url+'json/board/';
		var req = new XMLHttpRequest();
		req.open('GET',urlJson,true);
		req.responseType = 'text';
		req.onload = function(){
			if ( req.readyState === 4 && req.status === 200 ){
				if( req.response.substring(0,1) == '<' ){
					self.Login = new LoginView();
					self.Login.render();
				}else{
					var data = JSON.parse(req.response);
					self.data(data);
				}
			}else if( req.readyState === 4 && req.status === 404 ){

			}
		}
		req.send(null);
	},

	data : function(resp){
		var self = this;

		this.User = new UserView({ model: new UserModel({ username : resp.user.username, first_name: resp.user.first_name, last_name: resp.user.last_name }) });
		this.User.displayUser();
		// Active Tasks
		this.tasks = new TaskCollection();
		if( resp.tasks.length > 0 ){
			$.each( resp.tasks, function(k,i){
				self.tasks.add( new TaskModel({
					pkid: i.id,
					name: i.nombre,
					description: i.descripcion,
					startDate: i.fecha_inicial,
					project: i.proyecto.nombre,
					module: i.modulo.nombre,
				}));
			});
		}
		this.taskView = new TaskView({ collection: this.tasks });
		this.taskView.render();
		// Old Tasks
		this.oldTasks = new TaskCollection();
		if( resp.last_tasks.length > 0 ){
			$.each( resp.last_tasks, function(k,i){
				self.oldTasks.add( new TaskModel({
					pkid : i.id,
					name : i.nombre,
					status : i.status_id,
					project : i.proyecto.nombre,
					module : i.modulo.nombre,
				}));
			});
		}
		this.oldTaskView = new OldTaskView({ collection : this.oldTasks });
		this.oldTaskView.render();
	},

	timer: function(time){
		//this.clockView = new ClockView();
		if( time != '' ){
			time = 1000;
		}

		var self = this;
		var clockTime = setInterval(function(){
			var clock = new Date;
			if( clock.getHours() === 17 && clock.getMinutes() === 00 ){
				self.notification();
				clearInterval(clockTime);
			}
		},time);
	},

	notification: function(){
		var opt = {
			type: "basic",
			title: "Khaleesi time",
			message: "Es hora de partir y aun tienes tareas iniciadas",
			iconUrl: "../img/keep.png"
		}
		chrome.notifications.create('notification_1',opt,function(id){ console.log(chrome.runtime.lastError); });
	}

});
