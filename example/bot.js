var irc = require('irc');
var c = require('./');

var channel = '#colortest1234';
var client = new irc.Client('irc.freenode.com', 'colorbot1234', {
  channels: [channel]
});

client.on('message' + channel, function (from, message) {
  client.say(channel, 'echo ' + c.underline(message));
});

