var React = require('react/addons');

var Header = require('./partials/header');
var UserList = require('./partials/userList');
var MessageBox = require('./partials/messageBox');

var ES6Test = require('./es6test');
ES6Test.start();

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

React.render(<Page />, document.getElementById('page'));