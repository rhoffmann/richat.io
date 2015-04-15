var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('public/dist'));

var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('richat.io listening at %s:%s', host, port);
});