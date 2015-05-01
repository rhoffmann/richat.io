var React = require('react/addons');
var MessagesActions = require('../actions/messages');
var MessagesStore = require('../stores/messages');

var ReplyBox = React.createClass({
  getInitialState: function() {
    return {
      value: ''
    };
  },
  updateValue: function (e) {
    this.setState({
      value: e.target.value
    });
  },
  handleKeyDown: function(e) {
    if (e.keyCode === 13) {
      if (this.refs.replyBox.getDOMNode().value === '') { return; }

      MessagesActions.sendMessage(MessagesStore.getOpenChatUserID(), this.state.value);

      this.setState({
        value: ''
      }, function() {
        this.refs.replyBox.getDOMNode().focus();
      });
    }
  },
  render: function() {
    return (
      <div className="reply-box">
        <input
          ref="replyBox"
          value={ this.state.value }
          onChange={ this.updateValue }
          onKeyDown={ this.handleKeyDown }
          className="reply-box__input"
          placeholder="Type message to reply.." />
        <span className="reply-box__tip">
          Press <span className="reply-box__tip__button">Enter</span> to send
        </span>
      </div>
    );
  }
});

module.exports = ReplyBox;
