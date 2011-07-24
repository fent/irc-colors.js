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
* <span style="color:white;background-color:black">**white**</span>
* <span style="color:black">**black**</span>
* <span style="color:navy">**navy**</span>
* <span style="color:green">**green**</span>
* <span style="color:red">**red**</span>
* <span style="color:brown">**brown (maroon)**</span>
* <span style="color:purple">**purple (violet)**</span>
* <span style="color:olive">**olive**</span>
* <span style="color:yellow">**yellow**</span>
* <span style="color:lime">**light green (lime)**</span>
* <span style="color:teal">**teal (blue cyan)**</span>
* <span style="color:darkcyan">**cyan (aqua)**</span>
* <span style="color:blue">**blue (royal)**</span>
* <span style="color:fuchsia">**pink (light purple) (fuchsia)**</span>
* <span style="color:gray">**gray (grey)**</span>
* <span style="color:silver">**light gray (light grey) (silver)**</span>

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

