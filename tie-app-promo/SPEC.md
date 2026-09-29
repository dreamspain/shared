# TIE Hoy App Promo — Standard Block

> Golden source: `TIEHoy_App_Promo_Classic_v4_Articulated.html`
> Production: `TieHoyAppBridge.astro` (SCLT monorepo)

## Structure

Three planes: **identity → capability → action**.

```
La app                          ← 9px uppercase sans, muted
🌺 TIE Hoy                     ← 48px Georgia, "Hoy" italic seal
Consulta tu lote.               ← 19px Georgia, light body
Sigue tu oficina.               ← 19px Georgia, medium body
Recibe el aviso cuando avance.  ← 21px Georgia, ink (crescendo)
 Abrir TIE Hoy →              ← 17px Georgia, seal, grid layout
```

## Spacing Token

- Top margin to adjacent block: **24px**
- Bottom margin to adjacent block: **24px**
- Internal padding: `22px 0 20px 25px`

## Visual Signature

- Left seal bar: `2px #8A3F31`, 48px tall, anchored to brand zone
- Bottom hairline: `1px solid #D8D5CF`
- Background: none (inherits warm paper `#FCFBF8`)
- Orchid logo: `/orchid-logo.png` 28×28, opacity 0.85, next to "TIE Hoy"
- Apple icon: SVG path, 19×19, `fill: currentColor` (inherits seal)
- CTA arrow: `→` with `translateX(3px)` on hover

## Design Principles Alignment

- §3 serif = fact (Georgia 400 for all text)
- §4 seal appears 3 times (left bar, "Hoy" italic, CTA) — within budget
- §5 CTA = invitation (serif italic feel, no solid button)
- §7 separation = hint (2px seal bar, bottom hairline)
- §9 paper background, no overlay

## Languages

5 languages: es, en, fr, ru, zh. Copy per context (consultar/province/office/hub).

## Files

- `golden.html` — standalone Golden HTML reference (do not edit, read-only)
- `TieHoyAppBridge.astro` — production Astro component snapshot
