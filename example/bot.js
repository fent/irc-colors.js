var irc = require('irc');
var c = require('./');

var channel = '#rolytest1234';
var client = new irc.Client('irc.freenode.com', 'rolybot1234', {
  channels: [channel]
});

client.on('message' + channel, function (from, message) {
  client.say(channel, 'echo ' + c.underline(message));
});

