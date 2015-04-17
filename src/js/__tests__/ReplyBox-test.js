jest.dontMock('../stores/messages');

var mockRegister = MyDispatcher.register;
var mockRegisterInfo = mockRegister.mock;
var callsToRegister = mockRegisterInfo.calls;
var firstCall = callsToRegister[0];
var firstArgument = firstCall[0];
var callback = firstArgument;

callback = MyDispatcher.register.mock.calls[0][0];