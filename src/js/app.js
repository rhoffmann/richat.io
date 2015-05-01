var React = require('react/addons');

var Header = require('./partials/header');
var UserList = require('./partials/userList');

import MessageBox from './partials/messageBox';
var MessagesActions = require('./actions/messages');
var MessagesStore = require('./stores/messages');
var UserStore = require('./stores/user');

function state() {
    return {
        chats : MessagesStore.getAllChats(),
        user : UserStore.user.id,
        activeChat : MessagesStore.getActiveChat()
    }
}

let App = React.createClass({

    getInitialState: state,
    componentWillMount()    { MessagesStore.subscribe(this._update); },
    componentDidMount()     { MessagesActions.poll(); },
    componentWillUnmount()  { MessagesStore.unsubscribe(this._update); },
    _update()               {
        this.setState( state() )
    },
    displayName : "App",
    render() {
        return (
            <div className="app">
                <Header chats={this.state.chats} />
                <UserList user={this.state.user} chats={this.state.chats} />
                <MessageBox user={this.state.user} chat={this.state.activeChat} />
            </div>
        );
    }
});

React.render(<App />, document.getElementById('page'));