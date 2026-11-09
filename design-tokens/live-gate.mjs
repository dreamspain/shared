#!/usr/bin/env node
/**
 * Live visual clarity gate (shared by tiehoy-web and sclt.es releases).
 * Renders each page at 402×874 in Playwright Chromium (consumer provides @playwright/test) and runs
 * clarityProbe: translucent elements, gradient backgrounds, text under 4.5:1. Counts per page ratchet
 * against the consumer's baseline; a rise exits 1 so the release phase fails (and rolls back / alerts).
 *
 * --pages  JSON list of { "path": "/tie/" } or { "id": "loteNotify", "lang": "es", "params": {...} }
 *          (ids resolve through this package's route contract, so renames never break the list)
 * Usage: live-gate.mjs --origin <url> --pages <pages.json> --baseline <baseline.json> [--update-baseline]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { pathFor } from '../dist/index.js';
import { clarityProbe } from './clarity-probe.mjs';

const args = process.argv.slice(2);
const argOf = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const origin = (argOf('--origin') || '').replace(/\/$/, '');
const pagesFile = argOf('--pages');
const baselineFile = argOf('--baseline');
if (!origin || !pagesFile || !baselineFile) {
  console.error('usage: live-gate.mjs --origin <url> --pages <pages.json> --baseline <baseline.json> [--update-baseline]');
  process.exit(2);
}
const pages = JSON.parse(readFileSync(resolve(pagesFile), 'utf8'));
const baseline = existsSync(resolve(baselineFile)) ? JSON.parse(readFileSync(resolve(baselineFile), 'utf8')) : {};
const next = {};
const failures = [];
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 402, height: 874 } });
  for (const entry of pages) {
    const path = entry.path ?? pathFor(entry.id, entry.lang, entry.params);
    const key = entry.path ?? `${entry.id}:${entry.lang}`;
    const url = origin + path;
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(2500);
    const found = await page.evaluate(clarityProbe);
    next[key] = Object.fromEntries(Object.entries(found).map(([k, v]) => [k, v.length]));
    for (const [rule, hits] of Object.entries(found)) {
      const allowed = baseline[key]?.[rule] ?? 0;
      if (hits.length > allowed) failures.push(`${rule} ${url}: ${hits.length} > baseline ${allowed}\n    ${hits.slice(0, 6).join('\n    ')}`);
    }
  }
} finally {
  await browser.close();
}
if (args.includes('--update-baseline')) {
  writeFileSync(resolve(baselineFile), JSON.stringify(next, null, 2) + '\n');
  console.log(`live clarity baseline written (${Object.keys(next).length} pages)`);
} else if (failures.length) {
  console.error('Live visual clarity gate FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
} else {
  console.log(`Live visual clarity gate PASS: ${Object.keys(next).length} pages`);
}
