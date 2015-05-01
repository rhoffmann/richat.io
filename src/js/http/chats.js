var Firebase = require('firebase');
var Fireproof = require('fireproof');
var Q = require('q');

Fireproof.bless(Q);

var ref = new Firebase('https://vivid-inferno-3500.firebaseio.com/');
var fp = new Fireproof(ref);

module.exports = {
    fetch: function() {
      return fp.child('chats');
    },
    add: function(userID, message) {
      return fp.child('chats/'+userID+'/messages/').push(message);
    }
};
