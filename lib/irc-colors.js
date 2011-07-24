(function() {
  var addGetters, bg, c, code, color, colorArr, colors, f1, fg, funcs, i, name1, pos2, style, styles, _i, _len;
  colors = {
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
  styles = {
    '\x00': 'normal',
    '\x01': 'underline',
    '\x02': 'bold',
    '\x16': 'italic'
  };
  module.exports = funcs = {};
  c = '\x03';
  pos2 = c.length + 2;
  for (i in colors) {
    colorArr = colors[i];
    fg = (function(i) {
      return function(str) {
        return "" + c + i + str + c;
      };
    })(i);
    bg = (function(i) {
      return function(str) {
        var pos;
        pos = str.indexOf(c);
        if (pos !== 0) {
          return "" + c + "01," + i + str + c;
        } else {
          return "" + (str.substr(pos, pos2)) + "," + i + (str.substr(pos2));
        }
      };
    })(i);
    for (_i = 0, _len = colorArr.length; _i < _len; _i++) {
      color = colorArr[_i];
      funcs[color] = fg;
      funcs['bg' + color] = bg;
    }
  }
  for (code in styles) {
    style = styles[code];
    funcs[style] = (function(code) {
      return function(str) {
        return "" + code + str + code;
      };
    })(code);
  }
  funcs.rainbow = function(str) {
    var c, rainbowColors, s, _j, _len2, _ref;
    rainbowColors = ['red', 'olive', 'yellow', 'green', 'blue', 'navy', 'violet'];
    i = 0;
    s = '';
    _ref = str.split('');
    for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
      c = _ref[_j];
      if (c !== ' ') {
        s += funcs[rainbowColors[i++ % rainbowColors.length]](c);
      }
    }
    return s;
  };
  addGetters = function(name1, f1) {
    var f2, name2, _results;
    _results = [];
    for (name2 in funcs) {
      f2 = funcs[name2];
      if (name1 !== name2) {
        _results.push(f1.__defineGetter__(name2, (function(name2, f2) {
          return function() {
            var newF;
            newF = function(str) {
              return f2(f1(str));
            };
            addGetters(name2, newF);
            return newF;
          };
        })(name2, f2)));
      }
    }
    return _results;
  };
  for (name1 in funcs) {
    f1 = funcs[name1];
    addGetters(name1, f1);
  }
  module.exports.global = function() {
    var addGlobalGetters, f1, irc, name1, t, _results;
    t = null;
    irc = {};
    String.prototype.__defineGetter__('irc', function() {
      t = this;
      return irc;
    });
    addGlobalGetters = function(name1, f1) {
      var f2, name2, _results;
      _results = [];
      for (name2 in funcs) {
        f2 = funcs[name2];
        if (name1 !== name2) {
          _results.push(f1.__defineGetter__(name2, (function(name2, f2) {
            return function() {
              var newF;
              newF = function(str) {
                return f2(f1(t));
              };
              addGlobalGetters(name2, newF);
              return newF;
            };
          })(name2, f2)));
        }
      }
      return _results;
    };
    _results = [];
    for (name1 in funcs) {
      f1 = funcs[name1];
      if (name1 !== 'global') {
        _results.push(irc[name1] = (function(name1, f1) {
          var newF;
          newF = function() {
            return f1(t);
          };
          addGlobalGetters(name1, newF);
          return newF;
        })(name1, f1));
      }
    }
    return _results;
  };
}).call(this);
