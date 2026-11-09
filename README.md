# dreamspain/shared

Cross-project shared standard blocks and design assets.

## Standard Blocks

| Block | Source | Used in |
|-------|--------|---------|
| `tie-app-promo/` | TIEHoy_App_Promo_Classic_v4_Articulated | sclt.es/tie/*, tiehoy.com |

## TIEHoy route contract package

The repository root is a dependency-free ESM package, `@dreamspain/tiehoy-route-contract`.
Pin consumers to a reviewed Git commit rather than a branch:

```json
{
  "dependencies": {
    "@dreamspain/tiehoy-route-contract": "github:dreamspain/shared#<commit-sha>"
  }
}
```

It exports compiled JavaScript in `dist/`, TypeScript declarations, the frozen route
manifest, and strict URL helpers such as `pathFor`, `canonicalFor`, `alternatesFor`,
`matchRoute`, and `resolveLegacyPath`.

### Legacy Worker adapter

`resolveLegacyPath(pathname)` is the sole pathname-only source for direct historical
404/410 responses and 301 aliases. Its explicit match policies preserve whether a
historical route is exact, prefix-based, or accepts exactly one trailing slash; the
four residence retirements accept both their unslashed and one-trailing-slash forms.
It performs no general slash normalization or query parsing. For a redirect, an
adapter must use its returned `targetPath` and preserve its request URL's query string
itself; query retention is an adapter responsibility.
The resolver returns `null` for a string containing `?` or `#` so callers pass only
`URL.pathname`.

### Reproducible package checks

Run `npm ci`, then `npm run check:dist` to rebuild with the pinned local TypeScript
compiler and fail if committed `dist/` is stale. `npm test` validates the contract and
`npm pack --dry-run` verifies the publish surface.

## Design tokens

`@dreamspain/tiehoy-route-contract/design-tokens.css` is the single source of color, type and line
values for tiehoy-web, the TIE Hoy extension and sclt.es TIE pages (`design-tokens/tokens.css`).
Consumers reference `--tie-*` variables and never repeat the hex values. The sheet also resets
`:disabled` controls to `opacity: 1` — Chrome otherwise renders a disabled `<select>` at 0.7.
Standard: `drafts/80-tiehoy/09-页面视觉标准/SCLT_DESIGN_PRINCIPLES_v2.md`.

## Visual clarity gate

`design-tokens/check-css.mjs` (bin `tiehoy-check-css`) is the one rule set every consumer runs on its CSS:
no translucent layers (opacity between 0 and 1 outside :hover/:active/:focus and @keyframes), no
background gradients, no blur/backdrop-filter/blend modes, no translucent backgrounds, and color
literals outside the tokens sheet may only go down. Existing violations sit in each repo's baseline
JSON; counts may fall, never rise.

    node node_modules/@dreamspain/tiehoy-route-contract/design-tokens/check-css.mjs --baseline visual-baseline.json <css files>
