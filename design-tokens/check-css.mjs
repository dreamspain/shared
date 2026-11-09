#!/usr/bin/env node
// Visual clarity gate for TIE Hoy CSS (standard: SCLT_DESIGN_PRINCIPLES_v2 §9 + the permanent ban on decorative blur).
// Dependency-free so every consumer (tiehoy-web, extension, sclt.es) runs the same rules.
//
// Hard rules (any new occurrence fails):
//   translucency  — opacity strictly between 0 and 1, except transient states (:hover/:active/:focus) and @keyframes
//   gradient      — *-gradient() in any background
//   blur          — filter: blur(), backdrop-filter, mix-blend-mode, background-blend-mode
//   alpha-bg      — background(-color) with an alpha below 1 (rgba/hsla/#rrggbbaa), except transparent
// Ratchet rule:
//   hex           — color literals outside the tokens sheet may only go down per file
//
// Existing violations live in a baseline file; counts may fall, never rise.
// Usage: check-css.mjs --baseline <file.json> [--update-baseline] <css files...>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); if (i === -1) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const baselinePath = flag('--baseline');
const update = args.includes('--update-baseline');
const files = args.filter((a) => a !== '--update-baseline');
if (!baselinePath || files.length === 0) {
  console.error('usage: check-css.mjs --baseline <file.json> [--update-baseline] <css files...>');
  process.exit(2);
}

const TRANSIENT = /:(hover|active|focus|focus-visible|focus-within)\b/;
const ALPHA = /(rgba|hsla)\(([^)]*)\)|#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{4}\b/g;
const HEX = /#[0-9a-fA-F]{3,8}\b/g;

function alphaBelowOne(value) {
  for (const m of value.matchAll(ALPHA)) {
    if (m[1]) {
      const parts = m[2].split(/[\s,/]+/).filter(Boolean);
      if (parts.length === 4) {
        const a = parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
        if (a > 0 && a < 1) return true;
      }
    } else {
      const hex = m[0].slice(1);
      const a = parseInt(hex.length === 8 ? hex.slice(6) : hex.slice(3).repeat(2), 16) / 255;
      if (a > 0 && a < 1) return true;
    }
  }
  return false;
}

// Walk the stylesheet keeping the selector / at-rule stack; yield every declaration with its context.
function* declarations(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  const stack = [];
  let buf = '';
  let line = 1;
  let quote = null;
  let paren = 0;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '\n') line++;
    if (quote) { buf += ch; if (ch === quote && src[i - 1] !== '\\') quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === '(') paren++;
    if (ch === ')') paren--;
    if (paren > 0) { buf += ch; continue; }
    if (ch === '{') { stack.push(buf.trim()); buf = ''; continue; }
    if (ch === ';' || ch === '}') {
      const decl = buf.trim();
      const colon = decl.indexOf(':');
      if (colon > 0 && stack.length) {
        yield { prop: decl.slice(0, colon).trim().toLowerCase(), value: decl.slice(colon + 1).trim(), ctx: stack, line };
      }
      buf = '';
      if (ch === '}') stack.pop();
      continue;
    }
    buf += ch;
  }
}

function scan(file) {
  const css = readFileSync(file, 'utf8');
  const isTokens = /design-tokens\/tokens\.css$|\/tokens\.css$/.test(file);
  const found = { translucency: [], gradient: [], blur: [], 'alpha-bg': [], hex: [] };
  for (const d of declarations(css)) {
    const inKeyframes = d.ctx.some((c) => /^@(-webkit-)?keyframes\b/.test(c));
    const selector = d.ctx[d.ctx.length - 1] || '';
    const where = `${file}:${d.line} ${selector.slice(0, 60)} { ${d.prop}: ${d.value.slice(0, 60)} }`;
    if (d.prop.startsWith('--')) { if (!isTokens && HEX.test(d.value)) found.hex.push(where); HEX.lastIndex = 0; continue; }
    if (d.prop === 'opacity') {
      const v = parseFloat(d.value);
      if (v > 0 && v < 1 && !inKeyframes && !TRANSIENT.test(selector)) found.translucency.push(where);
    }
    if (d.prop.startsWith('background') && /gradient\(/i.test(d.value)) found.gradient.push(where);
    if ((d.prop === 'filter' || d.prop === '-webkit-filter') && /blur\(/i.test(d.value)) found.blur.push(where);
    if (/^(-webkit-)?backdrop-filter$|^mix-blend-mode$|^background-blend-mode$/.test(d.prop) && !/^(none|normal)$/i.test(d.value)) found.blur.push(where);
    if ((d.prop === 'background' || d.prop === 'background-color') && alphaBelowOne(d.value) && !TRANSIENT.test(selector)) found['alpha-bg'].push(where);
    if (!isTokens) { const n = (d.value.match(HEX) || []).length; for (let k = 0; k < n; k++) found.hex.push(where); }
  }
  return found;
}

const baseline = existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, 'utf8')) : {};
const next = {};
const failures = [];
let improved = false;
for (const file of files) {
  const found = scan(file);
  next[file] = Object.fromEntries(Object.entries(found).map(([k, v]) => [k, v.length]).filter(([, n]) => n > 0));
  for (const [rule, hits] of Object.entries(found)) {
    const allowed = baseline[file]?.[rule] ?? 0;
    if (hits.length > allowed) failures.push(`${rule}: ${file} has ${hits.length}, baseline ${allowed}\n    ${hits.slice(0, 8).join('\n    ')}`);
    if (hits.length < allowed) improved = true;
  }
  if (Object.keys(next[file]).length === 0) delete next[file];
}

if (update) {
  writeFileSync(baselinePath, JSON.stringify(next, null, 2) + '\n');
  console.log(`baseline written: ${baselinePath}`);
  process.exit(0);
}
if (failures.length) {
  console.error('Visual clarity gate FAILED (SCLT_DESIGN_PRINCIPLES_v2 §9, decorative blur ban):\n  ' + failures.join('\n  '));
  console.error('Fix the CSS. Only lower the baseline (--update-baseline) after removing violations.');
  process.exit(1);
}
console.log(`Visual clarity gate PASS: ${files.length} files${improved ? ' (counts fell — run with --update-baseline to lock them in)' : ''}`);
