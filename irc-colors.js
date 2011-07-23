(function() {
  var addingObj, bg, bgColorFuncs, bgF, c, color, colorArr, colorF, colorFuncs, colors, extraFuncs, f, fg, i, name, obj, style, styleF, styleFuncs, styles, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _m, _ref, _ref2, _ref3;
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
  styles = {
    '\\x00': 'normal',
    '\\x01': 'underline',
    '\\x02': 'bold',
    '\\x16': 'italic'
  };
  bgColorFuncs = {};
  for (i in colors) {
    colorArr = colors[i];
    for (_i = 0, _len = colorArr.length; _i < _len; _i++) {
      color = colorArr[_i];
      bgColorFuncs[color] = (function(i) {
        return function(str) {
          return str.charAt(1) + ',' + i + str.substr(1);
        };
      })(i);
    }
  }
  styleFuncs = {};
  for (c in styles) {
    style = styles[c];
    styleFuncs[style] = (function(c) {
      return function(str) {
        return "" + c + str + c;
      };
    })(c);
  }
  colorFuncs = {};
  for (i in colors) {
    colorArr = colors[i];
    for (_j = 0, _len2 = colorArr.length; _j < _len2; _j++) {
      color = colorArr[_j];
      colorFuncs[color] = (function(i) {
        return function(str) {
          return "\\x03" + i + str + "\\x03";
        };
      })(i);
      /*
          for j, bgArr of colors
            for bg in bgArr
              colorFuncs[color][bg] = ((j) ->
                (str) ->
                  "\xx03#{i},#{j}#{str}\\x03"
              )(j)
          */
    }
  }
  extraFuncs = {
    rainbow: function(str) {
      var c, rainbowColors, s, _k, _len3, _ref;
      rainbowColors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'navy', 'violet'];
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
    colorF = colorFuncs[fg];
    for (bg in bgColorFuncs) {
      bgF = bgColorFuncs[bg];
      colorFuncs[fg][bg] = (function(bgF, colorF) {
        return function(str) {
          return bgF(colorF(str));
        };
      })(bgF, colorF);
    }
  }
  _ref = [colorFuncs, bgColorFuncs];
  for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
    obj = _ref[_k];
    for (color in obj) {
      colorF = obj[color];
      _ref2 = [styleFuncs, extraFuncs];
      for (_l = 0, _len4 = _ref2.length; _l < _len4; _l++) {
        addingObj = _ref2[_l];
        for (style in addingObj) {
          styleF = addingObj[style];
          obj[color][style] = (function(styleF, colorF) {
            return function(str) {
              return styleF(colorF(str));
            };
          })(styleF, colorF);
        }
      }
    }
  }
  for (style in styleFuncs) {
    styleF = styleFuncs[style];
    for (color in colorFuncs) {
      colorF = colorFuncs[color];
      styleFuncs[style][color] = (function(styleF, colorF) {
        return function(str) {
          return colorF(styleF(str));
        };
      })(styleF, colorF);
    }
  }
  module.exports = c = {};
  _ref3 = [colorFuncs, styleFuncs, extraFuncs];
  for (_m = 0, _len5 = _ref3.length; _m < _len5; _m++) {
    obj = _ref3[_m];
    for (name in obj) {
      f = obj[name];
      c[name] = (function(f) {
        return f;
      })(f);
    }
  }
  console.log(c.blue.white('time'));
  console.log(c.blue('blue'));
  console.log(c.bold('bold'));
  console.log(c.bold.grey('bold grey'));
  console.log(c.green.underline('green underline'));
  console.log(c.bold.white.black('bold white black'));
  console.log(c.white.black.italic('white black italic'));
}).call(this);
