var vows   = require('vows');
var assert = require('assert');
var      c = require('..');

// activate global syntax
// modifies the String prototype for a sugary syntax
c.global();


var txt = 'teeeeeest me';
var topicMacro = function(reg) {
  return {
    topic: function() {
      var obj = {};

      for (var key in tests) {
        if (tests.hasOwnProperty(key)) {
          var fn = reg ? c : tests[key][0].irc
            , s = key.split('.')
            ;

          for (var i in s) {
            if (s.hasOwnProperty(i)) {
              fn = fn[s[i]];
            }
          }

          obj[key] = reg ? fn(tests[key][0]) : fn();
        }
      }
      return obj;
    }
  };
};

var tests = {
  'blue'                             : [txt, '\x0312\u200B'           + txt + '\x03'],
  'white'                            : [txt, '\x0300\u200B'           + txt + '\x03'],
  'blue.white'                       : [txt, '\x0300\u200B\x0312\u200B'     + txt + '\x03\x03'],
  'bold'                             : [txt, '\x02'             + txt + '\x02'],
  'bold.grey'                        : [txt, '\x0314\u200B\x02'       + txt + '\x02\x03'],
  'underline'                        : [txt, '\x1F'             + txt + '\x1F'],
  'green.underline'                  : [txt, '\x1F\x0303\u200B'       + txt + '\x03\x1F'],
  'bold.white.black'                 : [txt, '\x0301\u200B\x0300\u200B\x02' + txt + '\x02\x03\x03'],
  'white.black.italic'               : [txt, '\x16\x0301\u200B\x0300\u200B' + txt + '\x03\x03\x16'],
  'bggray'                           : [txt, '\x0301,14'        + txt + '\x03'],
  'rainbow'                          : ['hello', '\x0304\u200Bh\x03\x0307\u200Be\x03\x0308\u200Bl\x03\x0303\u200Bl\x03\x0312\u200Bo\x03'],
  'rainbow.stripColors'              : ['hello', 'hello'],
  'bold.white.black.stripStyle'      : [txt, '\x0301\u200B\x0300\u200B' + txt + '\x03\x03'],
  'rainbow.bold.stripColorsAndStyle' : ['hello', 'hello']
};

var regular = topicMacro(true);
var globalSyntax = topicMacro(false);

function test(key) {
  regular[key] = function(topic) {
    assert.equal(topic[key], tests[key][1]);
  };
  globalSyntax[key] = function(topic) {
    assert.equal(topic[key], tests[key][1]);
  };
}

for (var key in tests) {
  if (tests.hasOwnProperty(key)) {
    test(key);
  }
}

vows.describe('Test').addBatch({
    'Using regular syntax': regular
  , 'Using global syntax': globalSyntax
}).export(module);
