var Dispatcher = require('../dispatchers/app');
var UserStore = require('./user');
var EventEmitter = require('events').EventEmitter;

var chats = {};
var openChatID;

var messagesStore = Object.assign({}, EventEmitter.prototype, {
  subscribe: function (callback) {
    this.on('change', callback);
  },
  unsubscribe: function (callback) {
    this.off('change', callback);
  },
  getActiveChat: function() {
    return this.getChatByUserID(this.getOpenChatUserID());
  },
  getOpenChatUserID: function() {
    return openChatID;
  },
  getChatByUserID: function(id) {
    if (typeof id === 'undefined') {
      return { messages : [] };
    }
    return chats[id];
  },
  getAllChats: function() {
    return chats;
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
        contents: payload.action.contents,
        timestamp: payload.action.timestamp,
        from: payload.action.from
      });

      chats[userID].lastAccess.currentUser = +new Date();

      messagesStore.emit('change');
    },

    updateChats: function(payload) {
      chats = payload.action.chats;
      openChatID = parseInt(Object.keys(chats, 0), 10);
      messagesStore.emit('change');
    }
  }

  actions[payload.action.type] && actions[payload.action.type](payload);
});

module.exports = messagesStore;