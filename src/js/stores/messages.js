var Dispatcher = require('../dispatchers/app');
var UserStore = require('./user');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var chats = {};
var Firebase = require('firebase');
var ref = new Firebase('https://vivid-inferno-3500.firebaseio.com/');

var openChatID = parseInt(Object.keys(chats)[0], 10);

var messagesStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function (callback) {
    this.on('change', callback);
  },
  removeChangeListener: function (callback) {
    this.off('change', callback);
  },
  getOpenChatUserID: function() {
    return openChatID;
  },
  getChatByUserID: function(id) {
    return chats[id];
  },
  getAllChats: function() {
    return chats;
  }
});

ref.child('chats').on('value', function(snapshot) {
   chats = snapshot.val();
   if (chats) {
      openChatID = parseInt(Object.keys(chats)[0], 10);
      messagesStore.emit('change');
   } else {
      chats = {};
   }
});


messagesStore.dispatchToken = Dispatcher.register(function(payload) {

  var actions = {

    updateOpenChatID: function(payload) {
      openChatID = payload.action.userID;
      chats[openChatID].lastAccess.currentUser = +new Date();
      messagesStore.emit('change');
    },

    sendMessage: function(payload) {
      var userID = payload.action.userID;

      chats[userID] = chats[userID] || { user : UserStore.user, messages : [], lastAccess : {} };

      chats[userID].messages.push({
        contents: payload.action.message,
        timestamp: payload.action.timestamp,
        from: UserStore.user.id
      });

      chats[userID].lastAccess.currentUser = +new Date();

      ref.child('chats/'+ UserStore.user.id).set(chats[userID]);

      messagesStore.emit('change');
    }
  }

  actions[payload.action.type] && actions[payload.action.type](payload);
});

module.exports = messagesStore;