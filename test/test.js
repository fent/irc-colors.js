(function() {
  var c;
  c = require('../lib/irc-colors.js');
  console.log(c.blue('blue'));
  console.log(c.white('white'));
  console.log(c.blue.white('blue white'));
  console.log(c.bold('bold'));
  console.log(c.bold.grey('bold grey'));
  console.log(c.green.underline('green underline'));
  console.log(c.bold.white.black('bold white black'));
  console.log(c.white.black.italic('white black italic'));
}).call(this);
