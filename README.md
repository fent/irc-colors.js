Usage
------------------

    c = require('irc-colors');
    ...
    ircbot.say('#chan', c.blue('hello everyone')); // prints blue text
    ircbot.say('#chan', c.underline.red('WARNING')); // can be chained
    ircbot.say('#chan', c.white.black('inverted')); // white text with black background
    
    warn = c.bold.red.yellow;
    ircbot.say('#chan', warn('BIGGER WARNING')); // bold red text with yellow background
    ircbot.say('#chan', c.rainbow('having fun!'); // prints rainbow colored text

The style and extra functions can be used from the main *c* object or after another color, background color, or style. But background color functions must be used after a foreground color is used.

Colors
--------------
* <span style="color:white;background-color:black">**white**</span>
* <span style="color:black">**black**</span>
* <span style="color:navy">**blue (navy)**</span>
* <span style="color:green">**green**</span>
* <span style="color:red">**red**</span>
* <span style="color:brown">**brown (maroon)**</span>
* <span style="color:purple">**purple (violet)**</span>
* <span style="color:orange">**orange (olive)**</span>
* <span style="color:yellow">**yellow**</span>
* <span style="color:lime">**light green (lime)**</span>
* <span style="color:teal">**teal (blue cyan)**</span>
* <span style="color:aqua">**light cyan (cyan) (aqua)**</span>
* <span style="color:blue">**light blue (royal)**</span>
* <span style="color:fuchsia">**pink (light purple) (fuchsia)**</span>
* <span style="color:grey">**grey**</span>
* <span style="color:silver">**light grey (silver)**</span>

Original name or alternate can be used, without spaces

    bot.say('#chat', c.bluecyan('hi'));


Styles
------------
* **bold**
* *italic*
* <u>underline</u>


Extras
-----------
* **<span style="color:red">r</span><span style="color:orange">a</span><span style="color:yellow">i</span><span style="color:green">n</span><span style="color:blue">b</span><span style="color:navy">o</span><span style="color:purple">w</span>**


Installation
------------
Using npm:

    $ npm install irc-colors

