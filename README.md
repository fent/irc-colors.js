Usage
------------------

    ircc = require('irc-colors');
    ...
    ircbot.say('#chan', ircc.blue('hello everyone')); // prints blue text
    ircbot.say('#chan', ircc.underline.red('WARNING')); // can be chained
    ircbot.say('#chan', ircc.white.black('inverted')); // white text with black background
    
    warn = ircc.bold.red.yellow;
    ircbot.say('#chan', warn('BIGGER WARNING')); // bold red text with yellow background
    ircbot.say('#chan', ircc.rainbow('having fun!'); // prints rainbow colored text

The style and extra functions can be used from the main *ircc* object or after another color, background color, or style. But background color functions must be used after a foreground color is used.

Colors
--------------
* white
* black
* blue (navy)
* green
* red
* brown (maroon)
* purple
* orange (olive)
* yellow
* light green (lime)
* teal (blue cyan)
* light cyan (cyan) (aqua)
* light blue (royal)
* pink (light purple) (fuchsia)
* grey
* light grey (silver)

Original name or alternate can be used, without spaces

    bot.say('#chat', 'hi'.irc.bluecyan);


Styles
------------
* bold
* underline
* italic


Extras
-----------
* rainbow


Installation
------------
Using npm:

    $ npm install irc-colors

