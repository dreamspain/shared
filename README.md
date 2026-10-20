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
