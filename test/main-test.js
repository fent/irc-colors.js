var vows   = require('vows')
  , assert = require('assert')
  ,      c = require('..')

// activate global syntax
// modifies the String prototype for a sugary syntax
c.global();


var txt = 'teeeeeest me';
var topicMacro = function(reg) {
  return {
    topic: function() {
      var obj = {};

      for (var key in tests) {
        var fn = reg ? c : tests[key][0].irc
          , s = key.split('.')
          ;

        for (var i in s) {
          fn = fn[s[i]];
        }

        obj[key] = reg ? fn(tests[key][0]) : fn();
      }
      return obj;
    }
  };
};

var tests = {
  'blue'               : [txt, '12'       + txt + ''],
  'white'              : [txt, '00'       + txt + ''],
  'blue.white'         : [txt, '0012'   + txt + ''],
  'bold'               : [txt, ''         + txt + ''],
  'bold.grey'          : [txt, '14'     + txt + ''],
  'green.underline'    : [txt, '03'     + txt + ''],
  'bold.white.black'   : [txt, '0100' + txt + ''],
  'white.black.italic' : [txt, '0100' + txt + ''],
  'bggray'             : [txt, '01,14'    + txt + ''],
  'rainbow'            : ['hello', '04h07e08l03l12o']
};

var regular = topicMacro(true)
  , globalSyntax = topicMacro(false)
  ;


for (var key in tests) {
  (function(key) {
    regular[key] = function(topic) {
      assert.equal(topic[key], tests[key][1]);
    };
    globalSyntax[key] = function(topic) {
      assert.equal(topic[key], tests[key][1]);
    };
  })(key);
}

vows.describe('Test').addBatch({
  'Using regular syntax': regular,
  'Using global syntax': globalSyntax
}).export(module);
