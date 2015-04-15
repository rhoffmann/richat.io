var Dispatcher = require('../dispatchers/app');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var messages = {
  1: {
    user: {
      profilePicture: 'https://avatars0.githubusercontent.com/u/7922109?v=3&s=460',
      id: 1,
      name: 'Ryan Clark',
      status: 'online'
    },
    lastAccess: {
      recipient: 1424469794050,
      currentUser: 1424469794080
    },
    messages: [
      {
        contents: 'Hey!',
        from: 2,
        timestamp: 1424469793023
      },
      {
        contents: 'HeyHo!',
        from: 2,
        timestamp: 1424469793024
      },
      {
        contents: 'Hey, what\'s up?',
        from: 1,
        timestamp: 1424469794000
      },
      {
        contents: 'YUNO?',
        from: 2,
        timestamp: 1424469795000
      },
      {
        contents: 'WORK?',
        from: 1,
        timestamp: 1424469796000
      }
    ]
  },
  2 : {
    user: {
      profilePicture: 'https://avatars3.githubusercontent.com/u/678772?v=3&s=200',
      id: 2,
      name: 'Richard Hoffmann',
      status: 'online'
    },
    lastAccess: {
      recipient: 1424469794050,
      currentUser: 1424469794080
    },
    messages: [
      {
        contents: 'Hey!',
        from: 2,
        timestamp: 1424469793023
      },
      {
        contents: 'YUNO?',
        from: 2,
        timestamp: 1424469795000
      },
      {
        contents: 'WORK?',
        from: 1,
        timestamp: 1424469796000
      }
    ]
  }
};


var openChatID = parseInt(Object.keys(messages)[0], 10);

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
    return messages[id];
  },
  getAllChats: function() {
    return messages;
  }
});

messagesStore.dispatchToken = Dispatcher.register(function(payload) {

  var actions = {
    updateOpenChatID: function(payload) {
      openChatID = payload.action.userID;
      messagesStore.emit('change');
    }
  }

  actions[payload.action.type] && actions[payload.action.type](payload);
});

module.exports = messagesStore;