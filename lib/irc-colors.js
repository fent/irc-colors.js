var Hash = require('hashish');


var colors = {
  '00': ['white'],
  '01': ['black'],
  '02': ['navy'],
  '03': ['green'],
  '04': ['red'],
  '05': ['brown', 'maroon'],
  '06': ['purple', 'violet'],
  '07': ['olive'],
  '08': ['yellow'],
  '09': ['lightgreen', 'lime'],
  '10': ['teal', 'bluecyan'],
  '11': ['cyan', 'aqua'],
  '12': ['blue', 'royal'],
  '13': ['pink', 'lightpurple', 'fuchsia'],
  '14': ['gray', 'grey'],
  '15': ['lightgray', 'lightgrey', 'silver']
};

var styles = {
  normal    : '\x0F',
  underline : '\x1F',
  bold      : '\x02',
  italic    : '\x16'
};


// Coloring character.
var c = '\x03';
var pos2 = c.length + 2;
var zero = styles.bold + styles.bold;

// Make color functions for both foreground and background.
Hash(colors).forEach(function(colornames, code) {

  // Foreground.
  var fg = function(str) {
    return c + code + zero + str + c;
  };

  // Background.
  var bg = function(str) {
      var pos = str.indexOf(c);
      if (pos !== 0) {
        return c + '01,' + code + str + c;
      } else {
        return (str.substr(pos, pos2)) + ',' + code + (str.substr(pos2));
      }
    };

  colornames.forEach(function(color) {
    exports[color] = fg;
    exports['bg' + color] = bg;
  });
});


// Style functions.
Hash(styles).forEach(function(code, style) {
  exports[style] = function(str) {
    return code + str + code;
  };
});


// Extras.
exports.rainbow = function(str, colorArr) {
  var rainbow = ['red', 'olive', 'yellow', 'green',
                 'blue', 'navy', 'violet'];
  colorArr = colorArr ? colorArr : rainbow;  
  var l = colorArr.length;
  var i = 0;

  return str
    .split('')
    .map(function(c) {
      return c !== ' ' ? exports[colorArr[i++ % l]](c) : c;
    })
    .join('');
};

exports.stripColors = function(str) {
  return str.replace(/\x03\d{0,2}(,\d{0,2}|\x02\x02)?/g, '');
};

exports.stripStyle = function(str) {
  return str.replace(/([\x0F\x02\x16\x1F])(.+)\1/g, '$2');
};

exports.stripColorsAndStyle = function(str) {
  return exports.stripColors(exports.stripStyle(str));
};

// Adds all functions to each other so they can be chained.
var addGetters = function(f1, name) {
  Hash(exports).exclude([name]).forEach(function(f2, name) {
    f1.__defineGetter__(name, function() {
      var f = function(str) { return f2(f1(str)); };
      addGetters(f, name);
      return f;
    });
  });
};

Hash(exports).forEach(function(f, name) {
  addGetters(f, name);
});


// Adds functions to global String object.
exports.global = function() {
  var t, irc = {};

  String.prototype.__defineGetter__('irc', function() {
    t = this;
    return irc;
  });

  var addGlobalGetters = function(f1, name) {
    Hash(exports).exclude([name]).forEach(function(f2, name) {
      f1.__defineGetter__(name, function() {
        var f = function() { return f2(f1(t)); };
        addGetters(f, name);
        return f;
      });
    });
  };

  Hash(exports).exclude(['global']).forEach(function(f1, name) {
    var f = function() { return f1(t); };
    addGlobalGetters(f, name);
    irc[name] = f;
  });
};
