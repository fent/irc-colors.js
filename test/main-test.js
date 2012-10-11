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
  'blue'               : [txt, '\x0312'           + txt + '\x03'],
  'white'              : [txt, '\x0300'           + txt + '\x03'],
  'blue.white'         : [txt, '\x0300\x0312'     + txt + '\x03\x03'],
  'bold'               : [txt, '\x02'             + txt + '\x02'],
  'bold.grey'          : [txt, '\x0314\x02'       + txt + '\x02\x03'],
  'underline'          : [txt, '\x01'             + txt + '\x01'],
  'green.underline'    : [txt, '\x01\x0303'       + txt + '\x03\x01'],
  'bold.white.black'   : [txt, '\x0301\x0300\x02' + txt + '\x02\x03\x03'],
  'white.black.italic' : [txt, '\x16\x0301\x0300' + txt + '\x03\x03\x16'],
  'bggray'             : [txt, '\x0301,14'        + txt + '\x03'],
  'rainbow'            : ['hello', '\x0304h\x03\x0307e\x03\x0308l\x03\x0303l\x03\x0312o\x03']
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
