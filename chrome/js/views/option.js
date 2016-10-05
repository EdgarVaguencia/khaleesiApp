var Backbone = require('backbone'),
    $ = require('jquery')
    Backbone.$ = $;

module.exports = Backbone.View.extend({

  el : $('body'),

  events : {
    'keyup input#apikey' : 'checkUp',
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
        apikey = e.target.value,
        username = this.$el.find('input#username').val();
        console.info(username);
    if ( username.length > 0 && apikey.length == 40 ) {
      chrome.storage.sync.set({
        khaleesiKey : apikey,
        khaleesiUser : username
      }, function(){
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
      khaleesiKey : '',
      khaleesiUser : ''
    }, function(item){
      self.$el.find('input#apikey').val(item.khaleesiKey);
      self.apikey = item.khaleesiKey;
      self.username = item.khaleesiUser;
      self.$el.find('input#username').val(self.username);
    });
  },

  testing : function() {
    var self = this;
    this.recoveryData();
    var urlPlus = 'user/?username=' + self.username + '&api_key=' + self.apikey + '&format=json';
    $.ajax({
      url : Backbone.app.url+urlPlus,
      method : 'get',
      contentType: 'application/json',
      dataType: 'json',
      processData:  false,
      success : function(data){
        self.printResult(data);
      },
      error : function(xhr, ajaxOption, bind){
        self.$el.find('#result').html(xhr.responseText);
      }
    });
  },

  printResult: function(data) {
    var self = this,
        result = data['objects'][0];
    self.$el.find('div#result').html('<p>Fisrt name: '+ result['first_name'] +'</p><p>Last name: ' + result['last_name'] + '</p>');
  }

});
