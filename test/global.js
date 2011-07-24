(function() {
  require('../lib/irc-colors.js').global();
  console.log('blue'.irc.blue());
  console.log('greeen'.irc.green());
  console.log('blue white'.irc.blue.bgwhite());
  console.log('black white underline'.irc.black.bgwhite.underline());
  console.log('bold grey'.irc.bold.grey());
}).call(this);
