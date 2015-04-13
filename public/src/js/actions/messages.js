var Dispatcher = require('../dispatchers/app');

var messagesAction = {
  changeOpenChat: function(newUserID) {
    Dispatcher.handleViewAction({
      type: 'updateOpenChatID',
      userID: newUserID
    });
  }
};

module.exports = messagesAction;