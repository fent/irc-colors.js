var irc = require('irc');
var c = require('../');

var channel = '#colortest';
var client = new irc.Client('chat.freenode.net', 'colorbot1234', {
  channels: [channel]
});

client.on('message' + channel, function (from, message) {
  client.say(channel, 'underline: ' + c.underline(message));
  client.say(channel, 'bold:      ' + c.bold(message));
  client.say(channel, 'italic:    ' + c.italic(message));
});

