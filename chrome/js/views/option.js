var Backbone = require('backbone'),
    $ = require('jquery')
    Backbone.$ = $;

module.exports = Backbone.View.extend({

  el : $('body'),

  events : {
    'keyup input' : 'checkUp',
    'keydown input' : 'checkDown',
    'click .btn' : 'testing',
  },

  initialize : function(){
    this.recoveryData();
  },

  checkUp : function(e){
    var self = this,
        strokeCode = e.keyCode;

    switch(strokeCode){
      case 16: //Shift
      case 17: //Ctrl
      case 18: //Alt
      case 20: //CapLock
      case 38: // Arrow Up
      case 40: // Arrow Down
      case 91: //WindowLeft
      case 92: //WindowRight
      case 93: //SelectKey
        e.preventDefault();
        break;
      case 13: // Enter
      case 27: // Esc
        e.preventDefault();
        self.saveKey(e);
        break;
      default:
        self.saveKey(e);
        break;
    }
  },

  checkDown : function(e){
    var self = this,
        strokeCode = e.keyCode;

    switch(strokeCode){
      case 13: // Enter
      case 16: //Shift
      case 17: //Ctrl
      case 18: //Alt
      case 20: //CapLock
      case 27: // Esc
      case 38: // Arrow Up
      case 40: // Arrow Down
      case 91: //WindowLeft
      case 92: //WindowRight
      case 93: //SelectKey
        e.preventDefault();
        break;
    }
  },

  saveKey : function(e){
    var self = this,
        apikey = e.target.value;
    if( apikey.length == 40 ){
      chrome.storage.sync.set({
        khaleesiKey : apikey
      },function(){
        self.correct();
      })
    }
  },

  correct : function(){
    this.$el.find('#message').addClass('success').html('success');
  },

  recoveryData : function(){
    var self = this;
    chrome.storage.sync.get({
      khaleesiKey : ''
    },function(item){
      self.$el.find('input').val(item.khaleesiKey);
      self.apikey = item.khaleesiKey;
    });
  },

  testing : function(){
    var self = this,
        urlPlus = 'tarea/?username=edgar&api_key='+self.apikey+'&format=json';
    $.ajax({
      url : Backbone.app.url+urlPlus,
      /*beforeSend: function (xhr){
        xhr.setRequestHeader('Authorization', 'ApiKey evaguencia:'+self.apikey);
      },*/
      /*headers : {
        'Authorization': 'ApiKey edgar:'+self.apikey
      },*/
      method : 'get',
      contentType: 'application/json',
      dataType: 'json',
      processData:  false,
      success : function(data){
        console.log(data);
      },
      error : function(xhr, ajaxOption, bind){
        self.$el.find('#result').html(xhr.responseText);
      }
    });
  }

});
