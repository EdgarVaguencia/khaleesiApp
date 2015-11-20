'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var jQuery = require('jquery');
var jsonfile = require('jsonfile');
var util = require('util');
var Khaleesi = {
  Models: {},
  Collections: {},
  Views: {},
  Router: {},
  Options: {
    urlBase: 'http://localhost:8000' ,//'http://khaleesi.unisem.mx',
    urlBoard: '/api/v1/pizarron/',
    urlTarea: '/api/v1/tarea/',
    urlUser: '/api/v1/user/',
    urlDataJson: '?format=json'
  }
};

window.Khaleesi = Khaleesi;
