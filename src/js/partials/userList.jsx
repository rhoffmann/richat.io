var React = require('react/addons');
var Utils = require('../utils');

var sortBy = require('lodash/collection/sortBy');

// TODO: refactor to message collection
// TODO: refactor to props



var MessagesStore = require('../stores/messages');
var MessagesActions = require('../actions/messages');
var UserStore = require('../stores/user');

function state() {
  var allMessages = MessagesStore.getAllChats();

  var messageList = [];

  for (var id in allMessages) {
    var item = allMessages[id];

    var messages = sortBy(item.messages, 'timestamp');
    var messagesLength = messages.length;

    messageList.push({
      lastMessage: messages[messagesLength - 1],
      lastAccess: item.lastAccess,
      user: item.user
    });
  }

  return {
    openChatID: MessagesStore.getOpenChatUserID(),
    messageList: messageList
  };
}

var UserList = React.createClass({
  getInitialState: function () {
    return state();
  },
  componentWillMount: function() {
    MessagesStore.subscribe(this.onStoreChange);
  },
  componentWillUnmount: function() {
    MessagesStore.unsubscribe(this.onStoreChange);
  },
  onStoreChange: function() {
    this.setState(state());
  },
  changeOpenChat: function(id) {
    MessagesActions.changeOpenChat(id);
  },
  render: function () {
    this.state.messageList.sort(function (a, b) {
      if (a.lastMessage.timestamp > b.lastMessage.timestamp) {
        return -1;
      }
      if (a.lastMessage.timestamp < b.lastMessage.timestamp) {
        return 1;
      }
      return 0;
    });

    var messages = this.state.messageList.map(function (message, index) {
      var date = Utils.getNiceDate(message.lastMessage.timestamp);

      var statusIcon;
      if (message.lastMessage.from !== message.user.id) {
        statusIcon = (
          <i className="fa fa-reply user-list__item__icon" />
        );
      }
      if (message.lastAccess.currentUser < message.lastMessage.timestamp) {
        statusIcon = (
          <i className="fa fa-circle user-list__item__icon" />
        );
      }

      var isNewMessage = false;
      if (message.lastAccess.currentUser< message.lastMessage.timestamp) {
        isNewMessage = message.lastMessage.from !== UserStore.user.id;
      }

      var itemClasses = React.addons.classSet({
        'user-list__item': true,
        'clear': true,
        'user-list__item--new': isNewMessage,
        'user-list__item--active': this.state.openChatID === message.user.id
      });

      return (
        <li onClick={ this.changeOpenChat.bind(this, message.user.id) }
            className={ itemClasses }
            key={ message.user.id }>
          <div className="user-list__item__picture">
            <img src={ message.user.profilePicture } />
          </div>
          <div className="user-list__item__details">
            <h4 className="user-list__item__name">
              { message.user.name }

              <abbr className="user-list__item__timestamp">
                { date }
              </abbr>
            </h4>
            <span className="user-list__item__message">
              { statusIcon } { message.lastMessage.contents }
            </span>
          </div>
        </li>
      );
    }, this);

    return (
      <div className="user-list">
        <ul className="user-list__list">
          { messages }
        </ul>
      </div>
    );
  }
});

module.exports = UserList;
