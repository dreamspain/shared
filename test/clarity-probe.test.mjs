import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clarityProbe } from '../design-tokens/clarity-probe.mjs';

test('probe is a self-contained function for page.evaluate', () => {
  assert.equal(typeof clarityProbe, 'function');
  // page.evaluate serialises the function source: it must not close over module scope.
  const src = clarityProbe.toString();
  assert.doesNotMatch(src, /\bimport\b|\brequire\(/);
});
