var Dispatcher = require('flux').Dispatcher;

var appDispatcher = Object.assign(new Dispatcher(), {
  handleServerAction: function (action) {
    this.dispatch({
      source: 'server',
      action: action
    });
  },
  handleViewAction: function (action) {
    this.dispatch({
      source: 'view',
      action: action
    });
  }
});

module.exports = appDispatcher;
