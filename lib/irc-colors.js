const colors = {
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

const styles = {
  normal    : '\x0F',
  underline : '\x1F',
  bold      : '\x02',
  italic    : '\x16'
};

const styleChars = {};
Object.keys(styles).forEach(function(key) {
  styleChars[styles[key]] = true;
});


// Coloring character.
const c = '\x03';
const zero = styles.bold + styles.bold;

const allColors = {
  fg: [], bg: [], styles: Object.keys(styles), custom: [], extras: [],
};

// Make color functions for both foreground and background.
Object.keys(colors).forEach(function(code) {
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
      return (str.substr(pos, 3)) + ',' + code + (str.substr(5));
    }
  };

  colors[code].forEach(function(color) {
    allColors.fg.push(color);
    allColors.bg.push('bg' + color);
    exports[color] = fg;
    exports['bg' + color] = bg;
  });
});

// Style functions.
Object.keys(styles).forEach(function(style) {
  var code = styles[style];
  exports[style] = function(str) {
    return code + str + code;
  };
});

// Some custom helpers.
const custom = {
  rainbow: function(str, colorArr) {
    var rainbow = [
      'red', 'olive', 'yellow', 'green', 'blue', 'navy', 'violet'
    ];
    colorArr = colorArr || rainbow;
    var l = colorArr.length;
    var i = 0;

    return str
      .split('')
      .map(function(c) {
        return c !== ' ' ? exports[colorArr[i++ % l]](c) : c;
      })
      .join('');
  },
};

Object.keys(custom).forEach(function(extra) {
  allColors.custom.push(extra);
  exports[extra] = custom[extra];
});

// Extras.
const extras = {
  stripColors: function(str) {
    return str.replace(/\x03\d{0,2}(,\d{0,2}|\x02\x02)?/g, '');
  },

  stripStyle: function(str) {
    var path = [];
    var i, len, char;
    for (i = 0, len = str.length; i < len; i++) {
      char = str[i];
      if (styleChars[char] || char === c) {
        var lastChar = path[path.length - 1];
        if (lastChar && lastChar[0] === char) {
          var p0 = lastChar[1];
          // Don't strip out styles with no characters inbetween.
          // And don't strip out color codes.
          if (i - p0 > 1 && char !== c) {
            str = str.slice(0, p0) + str.slice(p0 + 1, i) + str.slice(i + 1);
            i -= 2;
          }
          path.pop();
        } else {
          path.push([str[i], i]);
        }
      }

    }

    // Remove any unmatching style characterss.
    // Traverse list backwards to make removing less complicated.
    for (i = path.length - 1; i >= 0; i--) {
      char = path[i];
      if (char[0] !== c) {
        var pos = char[1];
        str = str.slice(0, pos) + str.slice(pos + 1);
      }
    }
    return str;
  },

  stripColorsAndStyle: function(str) {
    return exports.stripColors(exports.stripStyle(str));
  },
};

Object.keys(extras).forEach(function(extra) {
  allColors.extras.push(extra);
  exports[extra] = extras[extra];
});

// Adds all functions to each other so they can be chained.
function addGetters(fn, types) {
  Object.keys(allColors).forEach(function(type) {
    if (types.indexOf(type) > -1) { return; }
    allColors[type].forEach(function(color) {
      if (fn[color] != null) { return; }
      Object.defineProperty(fn, color, {
        get: function() {
          var f = function(str) { return exports[color](fn(str)); };
          addGetters(f, [].concat(types, type));
          return f;
        },
      });
    });
  });
}

Object.keys(allColors).forEach(function(type) {
  allColors[type].forEach(function(color) {
    addGetters(exports[color], [type]);
  });
});


// Adds functions to global String object.
exports.global = function() {
  var str, irc = {};

  String.prototype.__defineGetter__('irc', function() {
    str = this;
    return irc;
  });

  for (var type in allColors) {
    allColors[type].forEach(function(color) {
      var fn = function() { return exports[color](str); };
      addGetters(fn, [type]);
      irc[color] = fn;
    });
  }
};
