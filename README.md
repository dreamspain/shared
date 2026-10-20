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

It exports compiled JavaScript in `dist/`, TypeScript declarations, the route manifest,
and strict URL helpers such as `pathFor`, `canonicalFor`, `alternatesFor`, and `matchRoute`.
