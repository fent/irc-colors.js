const vows   = require('vows');
const assert = require('assert');
const c      = require('..');

// Activate global syntax.
// Modifies the String prototype for a sugary syntax.
c.global();

const txt = 'test me';
const zero = c.bold('');
const tests = {
  'blue': [
    txt,
    '\x0312' + zero + txt + '\x03'
  ],
  'white': [
    txt,
    '\x0300' + zero + txt + '\x03'
  ],
  'bold': [
    txt,
    '\x02' + txt + '\x02'
  ],
  'bold.grey': [
    txt,
    '\x0314' + zero + '\x02'       + txt + '\x02\x03'
  ],
  'underline': [
    txt,
    '\x1F' + txt + '\x1F'
  ],
  'green.underline': [
    txt,
    '\x1F\x0303' + zero + txt + '\x03\x1F'
  ],
  'bold.white': [
    txt,
    '\x0300' + zero + '\x02' + txt + '\x02\x03'
  ],
  'white.italic': [
    txt,
    '\x16\x0300' + zero + txt + '\x03\x16'
  ],
  'bggray': [
    txt,
    '\x0301,14' + txt + '\x03'
  ],
  'blue.bgblack': [
    txt,
    '\x0312,01' + txt + '\x03'
  ],
  'rainbow': [
    'hello u',
    '\x0304' + zero + 'h\x03\x0307' + zero + 'e\x03\x0308' + zero +
    'l\x03\x0303' + zero + 'l\x03\x0312' + zero + 'o\x03 \x0302' + zero +
    'u\x03'
  ],
  'stripColors': [
    '\x0304' + zero + 'h\x03\x0307' + zero + 'e\x03\x0308' + zero +
    'l\x03\x0303' + zero + 'l\x03\x0312' + zero + 'o\x03',
    'hello'],
  'red.stripColors': ['hello', 'hello'],
  'bgblue.stripColors': ['hello', 'hello'],
  'red.bold.stripColors': [
    'hello',
    '\x02hello\x02'
  ],
  'bold.red.stripColors': [
    'hello',
    '\x02hello\x02'
  ],
  'stripStyle': [
    '\x0301' + zero + '\x02' + txt + '\x0F\x03',
    '\x0301' + zero + txt + '\x03'
  ],
  'blue.stripStyle': [
    'hello',
    '\x0312' + zero + 'hello\x03',
  ],
  'blue.bgblack.stripStyle': [
    'hello',
    '\x0312,01' + 'hello\x03'
  ],
  'bold.stripStyle': ['hello', 'hello'],
  'bold.blue.stripStyle': [
    'hello',
    '\x0312' + zero + 'hello\x03'
  ],
  'blue.bold.stripStyle': [
    'hello',
    '\x0312' + zero + 'hello\x03'
  ],
  'rainbow.stripStyle': [
    'hello',
    '\x0304' + zero + 'h\x03\x0307' + zero + 'e\x03\x0308' + zero +
    'l\x03\x0303' + zero + 'l\x03\x0312' + zero + 'o\x03'
  ],
  'stripColorsAndStyle': [
    '\x1Fone\x0F \x0312' + zero + '\x02hello\x03',
    'one hello'
  ]
};

const topicMacro = (reg) => {
  return {
    topic: () => {
      var obj = {};

      for (var key in tests) {
        var fn = reg ? c : tests[key][0].irc;
        var s = key.split('.');

        for (var i in s) {
          fn = fn[s[i]];
        }

        obj[key] = reg ? fn(tests[key][0]) : fn();
      }
      return obj;
    }
  };
};

const regular = topicMacro(true);
const globalSyntax = topicMacro(false);

function equal(expectedStr, gotStr) {
  var expectedBuf = new Buffer(expectedStr, 'utf8');
  var gotBuf = new Buffer(gotStr, 'utf8');
  assert.deepEqual(expectedBuf, gotBuf);
}

function test(key) {
  regular[key] = (topic) => {
    equal(topic[key], tests[key][1]);
  };
  globalSyntax[key] = (topic) => {
    equal(topic[key], tests[key][1]);
  };
}

for (var key in tests) {
  test(key);
}

vows.describe('Test').addBatch({
  'Using regular syntax': regular,
  'Using global syntax': globalSyntax
}).export(module);
