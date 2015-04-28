var Dispatcher = require('../dispatchers/app');

var httpChats = require('../http/chats');

var messagesAction = {
  changeOpenChat: function(newUserID) {
    Dispatcher.handleViewAction({
      type: 'updateOpenChatID',
      userID: newUserID
    });
  },
  sendMessage: function(userID, messageContent) {

    var message = {
      contents: messageContent,
      timestamp: +new Date(),
      from: userID
    };

    httpChats.add(userID, message);

    Dispatcher.handleViewAction({
      type: 'sendMessage',
      from: message.from,
      contents: message.contents,
      timestamp: message.timestamp
    });

  },
  updateChats: function(chats) {
    console.log('updateChats', chats.val());
    Dispatcher.handleServerAction({
      type: 'updateChats',
      chats: chats.val()
    });
  },
  poll: function() {
    httpChats.fetch().then(this.updateChats);
  }
};

module.exports = messagesAction;