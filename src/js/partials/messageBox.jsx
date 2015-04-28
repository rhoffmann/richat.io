var React = require('react/addons');
var ReplyBox = require('../components/replyBox');
var Utils = require('../utils');
var _ = require('lodash');

export default React.createClass({
    getDefaultProps() {
        return {
            chat: {
                lastAccess: +new Date(),
                from: {
                    '-1' : {}
                },
                messages: []
            },
            user : {
                id : '-1'
            }
        }
    },
    render() {
        var messagesLength = _.size(this.props.chat.messages);
        var currentUserID = this.props.user.id;

        var messages = _.map(this.props.chat.messages, function (message, index) {
            var messageClasses = React.addons.classSet({
                'message-box__item': true,
                'message-box__item--from-current': message.from === currentUserID,
                'clear': true
            });

            return (
                <li key={ message.timestamp + '-' + message.from } className={ messageClasses }>
                    <div className="message-box__item__contents">
                        { message.contents }
                    </div>
                </li>
            );
        });

        // if (messagesLength) {
        //     var lastMessage = _this.props.chat.messages;

        //     if (lastMessage.from === currentUserID) {
        //         if (this.props.chat.lastAccess.recipient >= lastMessage.timestamp) {
        //             var date = Utils.getShortDate(lastMessage.timestamp);
        //             messages.push(
        //                 <li key="read" className="message-box__item message-box__item--read">
        //                     <div className="message-box__item__contents">
        //                         Read { date }
        //                     </div>
        //                 </li>
        //             );
        //         }
        //     }
        // }

        return (
            <div className="message-box">
                <ul className="message-box__list">
                    { messages }
                </ul>
                <ReplyBox />
            </div>
        );
    }
});