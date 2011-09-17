Install
------------

    npm install irc-colors


Usage
------------------

    c = require('irc-colors');
    ...
    ircbot.say('#chan', c.blue('hello everyone')); // prints blue text
    ircbot.say('#chan', c.underline.red('WARNING')); // can be chained
    ircbot.say('#chan', c.white.bgblack('inverted')); // white text with black background
    
    warn = c.bold.red.bgyellow;
    ircbot.say('#chan', warn('BIGGER WARNING')); // bold red text with yellow background
    ircbot.say('#chan', c.rainbow('having fun!'); // prints rainbow colored text

### But wait, there's more!

If you don't mind changing the prototype of the String object, then use the global() function.

    require('irc-colors').global()
    ...
    ircbot.say('#chan', 'say something'.irc.red()); // prints red text
    ircbot.say('#chan', 'hi everyone!'.irc.green.bold()); // prints green bold text
    ircbot.say('#chan', 'etc etc'.irc.underline.grey.bgblack()) // chains work too

Global syntax was inspired by [colors.js](https://github.com/Marak/colors.js) and because of that, there's possibility that you might want to use that module along with this one. That's why the *irc* property of a String needs to be called first to use the formatting functions.


Colors
--------------
![colors](https://github.com/fent/irc-colors.js/raw/master/img/colors.png)

Original name or alternate can be used, without spaces

    bot.say('#chat', c.bluecyan('hi'));


Styles
------------
![styles](https://github.com/fent/irc-colors.js/raw/master/img/styles.png)


Extras
-----------
![extras](https://github.com/fent/irc-colors.js/raw/master/img/extras.png)

