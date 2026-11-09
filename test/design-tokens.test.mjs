import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../design-tokens/tokens.css', import.meta.url), 'utf8');
const vars = Object.fromEntries([...css.matchAll(/--(tie-[a-z]+):\s*(#[0-9a-f]{6})/g)].map((m) => [m[1], m[2]]));

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

test('package exports the token sheet', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.exports['./design-tokens.css'], './design-tokens/tokens.css');
  assert.ok(pkg.files.includes('design-tokens'));
});

test('text tokens clear 4.5:1 on paper', () => {
  for (const k of ['tie-ink', 'tie-body', 'tie-muted', 'tie-seal', 'tie-orchid']) {
    assert.ok(ratio(vars[k], vars['tie-paper']) >= 4.5, `${k} ${ratio(vars[k], vars['tie-paper']).toFixed(2)}`);
  }
});

test('quiet marks clear 3:1 on paper (non-text)', () => {
  assert.ok(ratio(vars['tie-quiet'], vars['tie-paper']) >= 3);
});

test('disabled controls are reset to opaque', () => {
  assert.match(css, /:where\(input, select, textarea, button\):disabled\s*\{\s*opacity:\s*1;/);
});
