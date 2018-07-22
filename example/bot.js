const irc = require('irc');
const c = require('../');

let channel = '#colortest';
let client = new irc.Client('irc.uk.mibbit.net', 'colorbot1234', {
  channels: [channel]
});

client.on('message' + channel, (from, message) => {
  client.say(channel, 'underline: ' + c.underline(message));
  client.say(channel, 'bold:      ' + c.bold(message));
  client.say(channel, 'italic:    ' + c.italic(message));
  client.say(channel, 'red:       ' + c.red(message));
  client.say(channel, 'rainbow:   ' + c.rainbow(message));
});

