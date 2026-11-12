import assert from 'node:assert';
import colors, { bold, red, stripColors } from '..';

describe('Exports', () => {
  it('Exposes default and named color helpers', () => {
    assert.strictEqual(colors.red, red);
    assert.strictEqual(colors.bold, bold);
    assert.strictEqual(colors.stripColors, stripColors);
  });
});
