import assert from 'node:assert';
import c, {
  bold,
  global as enableGlobal,
  rainbow,
  red,
  stripColors,
  stripColorsAndStyle,
  stripStyle,
} from '../src/irc-colors';

// Activate global syntax.
// Modifies the String prototype for a sugary syntax.
enableGlobal();

const txt = 'test me';
const badtxt = ',1 hi';
const zero = bold('');
const tests: Record<string, [string, string]> = {
  blue: [txt, `\x0312${txt}\x03`],
  white: [txt, `\x0300${txt}\x03`],
  red: [badtxt, `\x0304${zero}${badtxt}\x03`],
  bold: [txt, `\x02${txt}\x02`],
  'bold.grey': [txt, `\x0314\x02${txt}\x02\x03`],
  underline: [txt, `\x1F${txt}\x1F`],
  'green.underline': [txt, `\x1F\x0303${txt}\x03\x1F`],
  'bold.white': [txt, `\x0300\x02${txt}\x02\x03`],
  'white.italic': [txt, `\x1D\x0300${txt}\x03\x1D`],
  bggray: [txt, `\x0301,14${txt}\x03`],
  'blue.bgblack': [txt, `\x0312,01${txt}\x03`],
  'red.bgblack': [badtxt, `\x0304,01${badtxt}\x03`],
  rainbow: [
    'hello u',
    '\x0304' +
      'h\x03\x0307' +
      'e\x03\x0308' +
      'l\x03\x0303' +
      'l\x03\x0312' +
      'o\x03 \x0302' +
      'u\x03',
  ],
  stripColors: [
    '\x0304' +
      'h\x03\x0307' +
      'e\x03\x0308' +
      'l\x03\x0303' +
      'l\x03\x0312' +
      'o\x03',
    'hello',
  ],
  'red.stripColors': ['hello', 'hello'],
  'bgblue.stripColors': ['hello', 'hello'],
  'red.bold.stripColors': ['hello', '\x02hello\x02'],
  'bold.red.stripColors': ['hello', '\x02hello\x02'],
  stripStyle: [`\x0301\x02${txt}\x0F\x03`, `\x0301${txt}\x03`],
  'blue.stripStyle': ['hello', '\x0312hello\x03'],
  'blue.bgblack.stripStyle': ['hello', '\x0312,01hello\x03'],
  'bold.stripStyle': ['hello', 'hello'],
  'bold.blue.stripStyle': ['hello', '\x0312hello\x03'],
  'blue.bold.stripStyle': ['hello', '\x0312hello\x03'],
  'rainbow.stripStyle': [
    'hello',
    '\x0304' +
      'h\x03\x0307' +
      'e\x03\x0308' +
      'l\x03\x0303' +
      'l\x03\x0312' +
      'o\x03',
  ],
  stripColorsAndStyle: ['\x1Fone\x0F \x0312\x02hello\x03', 'one hello'],
};

const equal = (gotStr: string, expectedStr: string) => {
  const gotBuf = Buffer.from(gotStr, 'utf8');
  const expectedBuf = Buffer.from(expectedStr, 'utf8');
  assert.deepEqual(gotBuf, expectedBuf);
};

const resolveChain = (
  root: unknown,
  key: string,
): ((...args: unknown[]) => string) => {
  let current: unknown = root;
  for (const part of key.split('.')) {
    current = (current as Record<string, unknown>)[part];
  }
  return current as (...args: unknown[]) => string;
};

const runSuite = (
  suiteName: string,
  targetFn: (input: string) => {
    root: unknown;
    invoke: (fn: (...args: unknown[]) => string) => string;
  },
) => {
  describe(suiteName, () => {
    for (const [key, [input, expected]] of Object.entries(tests)) {
      it(`correctly formats ${key}`, () => {
        const { root, invoke } = targetFn(input);
        const fn = resolveChain(root, key);
        const got = invoke(fn);
        equal(got, expected);
      });
    }
  });
};

runSuite('Using regular syntax', (input) => ({
  root: c,
  invoke: (fn) => fn(input),
}));

runSuite('Using global syntax', (input) => ({
  root: input.irc,
  invoke: (fn) => fn(),
}));

describe('Rainbow with custom palette', () => {
  it('correctly uses custom palette', () => {
    const res = rainbow('abc', ['green', 'blue']);
    assert.equal(res, '\x0303a\x03\x0312b\x03\x0303c\x03');
  });
});

describe('Named and CJS exports', () => {
  it('supports direct named function calls and static chaining', () => {
    assert.equal(red('hi'), '\x0304hi\x03');
    assert.equal(bold('hi'), '\x02hi\x02');
    assert.equal(stripColors('\x0304hi\x03'), 'hi');
    assert.equal(stripStyle('\x02hi\x02'), 'hi');
    assert.equal(stripColorsAndStyle('\x0304\x02hi\x02\x03'), 'hi');
    assert.equal(c.bold.grey(txt), `\x0314\x02${txt}\x02\x03`);
    assert.equal(txt.irc.bold.grey(), `\x0314\x02${txt}\x02\x03`);
  });
});
