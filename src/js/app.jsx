var Header = require('./partials/header');
var UserList = require('./partials/userList');
var MessageBox = require('./partials/messageBox');

// var Firebase = require('firebase');
// var myFirebaseRef = new Firebase('https://vivid-inferno-3500.firebaseio.com');
// var chats = MessagesStore.getAllChats();
// myFirebaseRef.set({chats: chats});
// myFirebaseRef.child('chats/'+ MessagesStore.getOpenChatUserID() + '/messages').on('value', function(snapshot) {
//   console.log(snapshot.val());
// });

var Page = React.createClass({
	render: function () {
		return (
			<div className="app">
				<Header />

				<UserList />
				<MessageBox />
			</div>
		);
	}
});

React.render(<Page />, document.body);