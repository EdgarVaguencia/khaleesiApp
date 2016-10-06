var Backbone = require('backbone'),
    $ = require('jquery')
    Backbone.$ = $,
    LoginView = require('../views/login'),
    UserView = require('../views/user'),
    TaskView = require('../views/taskList'),
    OldTaskView = require('../views/oldTaskList'),
    //ClockView = require('../views/clock'),
    TaskCollection = require('../collections/task'),
    UserModel = require('../models/user'),
    TaskModel = require('../models/task'),
    _ = require('underscore'),
    Timer = require('../views/timer');
    OptionPage = require('../views/option');

module.exports = Backbone.Router.extend({

    routes :{
        // '_generated_background_page.html' : 'background',
        'index.html' : 'syncGetData',
        'options.html' : 'options',
    },

    initialize : function(obj) {
        if( typeof obj === 'object' ){
            this.url = obj.url;
        }
        /********************************************************
            Se deja de dar soporte por debido a lo poco usable
            que representa dicho contador.
            -- Adicional el propio sistema integra un detenido
            de tareas al término del día laboral --
        ********************************************************/
        // if( !localStorage.khaleesiTime ){
        //  localStorage['khaleesiTime'] = [];
        // }
        Backbone.history.start({ pushState : true });
    },

    syncGetData: function() {
        var self = this;
        chrome.storage.sync.get({
            khaleesiKey: '',
            khaleesiUser: ''
        }, function(item) {
            self.apikey = item.khaleesiKey;
            self.username = item.khaleesiUser;
            self.resource();
        });
    },

    resource : function() {
        var self = this;
        if (self.apikey && self.username) {
            self.resourceUser();
            self.resourceTask();
        }else {
            self.Login = new LoginView();
            self.Login.render();
        }
    },

    resourceUser: function() {
        var self = this;
        const urlUser = self.url + 'user/?username=' + self.username + '&api_key=' + self.apikey + '&format=json';
        var connect = self.resourceConnect(urlUser);

        if (connect) {
            connect.done(function(data) {
                var objects = data.objects[0];
                self.User = new UserView({ model: new UserModel({ ide: objects.id, username: self.username, first_name: objects.first_name, last_name: objects.last_name})});
                self.User.displayUser();
            });
        }
    },

    resourceTask: function() {
        var self = this;
        const urlta = self.url + 'tarea/?username=' + self.username + '&api_key=' + self.apikey + '&limit=100&format=json';
        var connect = self.resourceConnect(urlta);

        if (connect) {
            connect.done(function(data) {
                var objects = data.objects;
                if (objects.length > 0) {
                    self.tasks = new TaskCollection();
                    $.each(objects, function(k, i) {
                        /*************************************
                                Status
                                1 - Pendiente
                                2 - Proceso
                                3 - Pausado
                        *************************************/
                        if (i.pizarron_status > 0 && i.pizarron_status < 4) {
                            h_estimadas = i.horas_estimadas !== null ? i.horas_estimadas : 0;
                            self.tasks.add( new TaskModel({
                                pkid: i.id,
                                status: i.pizarron_status,
                                name: i.nombre,
                                description: i.descripcion,
                                startDate: i.fecha_inicial,
                                estimadas: h_estimadas,
                                reales: Math.round(i.horas_reales * 100) / 100,
                                url: i.resource_uri
                            }));
                        }
                    });
                    self.taskView = new TaskView({ collection: self.tasks.inStatus(2) });
                    self.taskView.render();
                    self.oldTaskView = new OldTaskView({ collection: self.tasks.inStatus(3) });
                    self.oldTaskView.render();
                }
            });
        }
    },

    resourceConnect: function(url) {
        return Backbone.$.ajax({
            url: url,
            method: 'get',
            contentType: 'application/json',
            dataType: 'json',
            processData: false,
        });
    },

    data : function(resp) {
        var self = this;

        this.User = new UserView({ model: new UserModel({ username : self.username, first_name: resp.user.first_name, last_name: resp.user.last_name }) });
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

    background : function(){
        window.backboneApp = Backbone;
        this.timer();
    },

    timer: function(time){
        var self = this;
        this.timers = [];
        if( localStorage.khaleesiTime.length > 0 ){
            tasklist = JSON.parse(localStorage.khaleesiTime);
            _.each(tasklist,function(i){
                if( !self.timer[i.cid] ){
                    self.timers[i.cid] = new Timer({ duration : i.elapsed, cid : i.cid });
                }
            });
        }
    },

    options : function(){
        var optionPage = new OptionPage();
    }

});
