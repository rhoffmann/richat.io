jest.dontMock('../partials/header.jsx');

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var Header = require('../partials/header.jsx');

describe('Header', function() {

  var header = TestUtils.renderIntoDocument(
      <Header />
  );

  beforeEach(function(){

  });

  it('starts with an empty message', function() {
    // var input = TestUtils.findRenderedDOMComponentWithClass(replyBox, 'reply-box__input');
    // expect(input.getDOMNode().textContent).toEqual('');
  });

  it('submits messages on enter', function() {
// React.addons.TestUtils.Simulate.click(node);
// React.addons.TestUtils.Simulate.change(node, {target: {value: 'Hello, world'}});
// React.addons.TestUtils.Simulate.keyDown(node, {key: "Enter"});
  });

  it('does not submit empty messages', function() {

  });
});
