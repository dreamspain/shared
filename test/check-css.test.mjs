import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const bin = new URL('../design-tokens/check-css.mjs', import.meta.url).pathname;
const run = (css, baseline = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'chk-'));
  const file = join(dir, 'a.css');
  const base = join(dir, 'base.json');
  writeFileSync(file, css);
  writeFileSync(base, JSON.stringify({ [file]: baseline }));
  try { return { code: 0, out: execFileSync('node', [bin, '--baseline', base, file], { encoding: 'utf8', stdio: 'pipe' }) }; }
  catch (e) { return { code: e.status, out: String(e.stderr) }; }
};

test('translucent layer fails; transient states and keyframes pass', () => {
  assert.equal(run('.plan{opacity:.5}').code, 1);
  assert.equal(run('.btn:active{opacity:.7}').code, 0);
  assert.equal(run('@keyframes f{from{opacity:.2}to{opacity:1}}').code, 0);
  assert.equal(run('.sr{opacity:0}').code, 0);
});

test('gradients, blur and translucent backgrounds fail', () => {
  assert.equal(run('.pay{background:linear-gradient(90deg,rgba(1,2,3,.07),transparent)}').code, 1);
  assert.equal(run('.x{backdrop-filter:blur(4px)}').code, 1);
  assert.equal(run('.x{filter:blur(2px)}').code, 1);
  assert.equal(run('.x{background:rgba(138,63,49,.055)}').code, 1);
  assert.equal(run('.x{background:#8a3f3180}').code, 1);
  assert.equal(run('.x{background:transparent}').code, 0);
});

test('hex literals ratchet against the baseline', () => {
  assert.equal(run('.a{color:#242321}').code, 1);
  assert.equal(run('.a{color:#242321}', { hex: 1 }).code, 0);
  assert.equal(run('.a{color:var(--tie-ink)}', { hex: 1 }).code, 0);
});

test('the shared tokens sheet itself passes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'chk-'));
  const base = join(dir, 'b.json');
  writeFileSync(base, '{}');
  const tokens = new URL('../design-tokens/tokens.css', import.meta.url).pathname;
  execFileSync('node', [bin, '--baseline', base, tokens], { stdio: 'pipe' });
});
