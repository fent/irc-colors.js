(function() {
  var addingObj, bg, bgColorFuncs, c, color, colorArr, colorFuncs, colors, extraFuncs, f, fg, i, irc, name, obj, style, styleFuncs, styles, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _m, _ref, _ref2, _ref3;
  colors = {
    '00': ['white'],
    '01': ['black'],
    '02': ['blue', 'navy'],
    '03': ['green'],
    '04': ['red'],
    '05': ['brown', 'maroon'],
    '06': ['purple', 'violet'],
    '07': ['orange', 'olive'],
    '08': ['yellow'],
    '09': ['lightgreen', 'lime'],
    '10': ['teal', 'bluecyan'],
    '11': ['lightcyan', 'cyan', 'aqua'],
    '12': ['lightblue', 'royal'],
    '13': ['pink', 'lightpurple', 'fuchsia'],
    '14': ['grey'],
    '15': ['lightgrey', 'silver']
  };
  colorFuncs = {};
  for (i in colors) {
    colorArr = colors[i];
    for (_i = 0, _len = colorArr.length; _i < _len; _i++) {
      color = colorArr[_i];
      colorFuncs[color] = function(str) {
        return "\x03" + i + str + "\x03";
      };
    }
  }
  bgColorFuncs = {};
  for (i in colors) {
    colorArr = colors[i];
    for (_j = 0, _len2 = colorArr.length; _j < _len2; _j++) {
      color = colorArr[_j];
      bgColorFuncs[color] = function(str) {
        return str.charAt(1) + ',' + i + str.substr(1);
      };
    }
  }
  styles = {
    '\x00': 'normal',
    '\x01': 'underline',
    '\x02': 'bold',
    '\x16': 'italic'
  };
  styleFuncs = {};
  for (c in styles) {
    style = styles[c];
    styleFuncs[style] = function(str) {
      return "" + c + str + c;
    };
  }
  extraFuncs = {
    rainbow: function(str) {
      var c, rainbowColors, s, _k, _len3, _ref;
      rainbowColors = ['red', 'orange', 'yellow', 'green', 'blue', 'lightblue', 'violet'];
      i = 0;
      s = '';
      _ref = str.split('');
      for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
        c = _ref[_k];
        if (c !== ' ') {
          s += colorFuncs[rainbowColors[i++ % rainbowColors.length]](c);
        }
      }
      return s;
    }
  };
  for (fg in colorFuncs) {
    for (bg in bgColorFuncs) {
      f = bgColorFuncs[bg];
      fg[bg] = f;
    }
  }
  _ref = [colorFuncs, bgColorFuncs];
  for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
    obj = _ref[_k];
    for (color in obj) {
      _ref2 = [styleFuncs, extraFuncs];
      for (_l = 0, _len4 = _ref2.length; _l < _len4; _l++) {
        addingObj = _ref2[_l];
        for (style in addingObj) {
          f = addingObj[style];
          obj[color][style] = f;
        }
      }
    }
  }
  module.exports = irc = {};
  _ref3 = [colorFuncs, styleFuncs, extraFuncs];
  for (_m = 0, _len5 = _ref3.length; _m < _len5; _m++) {
    obj = _ref3[_m];
    for (name in obj) {
      f = obj[name];
      irc[name] = f;
    }
  }
}).call(this);
