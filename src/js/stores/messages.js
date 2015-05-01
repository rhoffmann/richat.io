var Dispatcher = require('../dispatchers/app');
var UserStore = require('./user');
var EventEmitter = require('events').EventEmitter;

var sortBy = require('lodash/collection/sortBy');

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
      return { messages: [] };
    }
    return chats[id];
  },
  getAllChats: function() {
    return chats;
  }
});

messagesStore.dispatchToken = Dispatcher.register(function(payload) {

  var actions = {

    updateOpenChatID: function(data) {
      openChatID = data.action.userID;
      chats[openChatID].lastAccess.currentUser = +new Date();
      messagesStore.emit('change');
    },

    sendMessage: function(data) {
      var userID = data.action.from;

      chats[userID].messages.push({
        contents: data.action.contents,
        timestamp: data.action.timestamp,
        from: data.action.from
      });

      chats[userID].lastAccess.currentUser = +new Date();

      messagesStore.emit('change');
    },

    updateChats: function(data) {

      chats = data.action.chats;

      // all chat messages need to be converted into arrays
      Object.keys(chats).forEach(function(key) {
        chats[key].messages = sortBy(chats[key].messages, 'timestamp');
      });

      openChatID = parseInt(Object.keys(chats, 0), 10);
      messagesStore.emit('change');
    }
  };

  if (actions[payload.action.type]) {
    actions[payload.action.type](payload);
  }

});

module.exports = messagesStore;
