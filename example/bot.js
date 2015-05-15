var irc = require('irc');
var c = require('../');

var channel = '#rolytest';
var client = new irc.Client('chat.freenode.net', 'rolybot1234', {
  channels: [channel]
});

client.on('message' + channel, function (from, message) {
  client.say(channel, 'underline: ' + c.underline(message));
  client.say(channel, 'bold:      ' + c.bold(message));
  client.say(channel, 'italic:    ' + c.italic(message));
});

