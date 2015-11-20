/**
 * 
 */
'use strict';
Khaleesi.Models.Sync = Backbone.Model.extend({

   defaults: {
    'user': '',
    'token': '',
    'first_name': '',
    'last_name': '',
    'ide': '',
    'resource': ''
   },

  initialize: function() {
    this.listenTo(this, 'change', this.writeFile);
    this.readData();
  },

  datafile: __dirname + '/data.json',

  readData: function() {
    const self = this;
    var _obj = jsonfile.readFileSync(this.datafile);
    if (_obj !== null) {
      self.set({'user': _obj.user, 'token': _obj.token});
    }
  },

  writeFile: function() {
    const self = this;
    var param = {
      token: this.get('token'),
      user: this.get('user'),
      first_name: this.get('first_name'),
      last_name: this.get('last_name'),
      ide: this.get('ide'),
      resource: this.get('resource')
    }
    jsonfile.writeFile(self.datafile, param, function (err) {
      if (err !== null) {
        console.error(err);
      }
    });
  }
});
