// Rendered clarity probe — runs inside the page (Playwright page.evaluate(clarityProbe)).
// Measures what the static check-css gate cannot: the colors and opacity the browser actually paints.
//   translucent — visible element (area ≥ 400px²) whose effective opacity < 1, outside transient states
//   gradient    — visible element painting a gradient background
//   contrast    — visible text below 4.5:1 (3:1 for ≥ 24px, or ≥ 18.66px bold) against its painted background
// Returns { translucent: [...], gradient: [...], contrast: [...] } with short descriptors.
export function clarityProbe() {
  const parse = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); return { r, g, b, a }; };
  const lum = ({ r, g, b }) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const visible = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const bgOf = (e) => {
    for (let n = e; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a >= 1) return c; }
    return { r: 252, g: 251, b: 248, a: 1 };
  };
  const name = (e) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/)[0] : ''}`;
  const out = { translucent: [], gradient: [], contrast: [] };
  for (const e of [document.documentElement, document.body, ...document.querySelectorAll('body *')]) {
    if (!visible(e)) continue;
    const s = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    const op = parseFloat(s.opacity);
    if (op > 0 && op < 1 && r.width * r.height >= 400 && !e.matches(':hover, :active, :focus')) out.translucent.push(`${name(e)} opacity ${op}`);
    if (/gradient\(/.test(s.backgroundImage)) out.gradient.push(name(e));
    const hasText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!hasText || e.closest('svg')) continue;
    const fg = parse(s.color); if (!fg || fg.a === 0) continue;
    const size = parseFloat(s.fontSize); const bold = parseInt(s.fontWeight, 10) >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    const cr = ratio(fg, bgOf(e));
    if (cr < need) out.contrast.push(`${name(e)} "${e.textContent.trim().slice(0, 30)}" ${cr.toFixed(2)} < ${need}`);
  }
  return out;
}
