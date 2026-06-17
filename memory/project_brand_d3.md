---
name: project-brand-d3
description: mitbringen brand identity — Concept D3 "Basket + Check" chosen logo, color tokens, component location
metadata:
  type: project
---

The chosen logo is **D3 "Basket + Check"** from `/Users/wamci/projects/shopping-list-app/design_handoff_brand_d3/`. SVG source files are also copied to `assets/images/` in the mobile project.

The React Native mark component lives at `components/ui/MitbringenMark.tsx` and exports:
- `MitbringenMarkSvg` — raw SVG paths (variant: color / mono-blue / mono-white)
- `MitbringenTile` — blue gradient tile with the mark (size prop, default 44)
- `MitbringenWordmark` — horizontal lockup: tile + "mit(ink)bringen(blue)" text (size + theme props)

Color tokens from D3 handoff:
- Brand Blue: #2461ff · Tile gradient: #2f6bff → #1748d8
- Check Green: #2fc46f · Fresh Lime (leaf): #c4ec5a
- Savings Green: #12a150 · Ink: #0d1220 / #16202e
- Blue Soft (dark bg): #7aa0ff

Font: Schibsted Grotesk 800 ExtraBold for wordmark, tracking -0.045em.

**Why:** Design was provided via HTML handoff; D3 was explicitly selected. Component uses react-native-svg (installed SDK 54 compat version 15.12.1).

**How to apply:** Use `MitbringenWordmark` wherever the brand lockup appears. For new screens, import from `@/components/ui/MitbringenMark`.

## Icon PNG workflow

SVG sources live in `assets/images/` (`icon-app.svg`, `mark-color.svg`, `mark-mono-blue.svg`, `mark-mono-white.svg`). Generated PNGs are committed alongside them.

**To regenerate all PNGs after any SVG edit:**
```
npm run generate:icons
```
Script: `scripts/generate-icons.mjs` (uses `sharp` devDep). Outputs: `icon.png` (1024), `favicon.png` (48), `splash-icon.png` (512), `android-icon-foreground.png` (1024, mark centred on transparent), `android-icon-background.png` (1024, blue gradient), `android-icon-monochrome.png` (1024, Android 13+ themed mask).

**After regenerating, native icons need a rebuild to take effect:**
- Expo Go: PNG changes are picked up on next `expo start` for JS-rendered images, but the actual home-screen icon requires a native rebuild.
- `npx expo prebuild` → then rebuild in Xcode / Android Studio.
- Or trigger an EAS Build (`eas build`).

The `app.json` paths already point to the correct files — no config change needed after re-running the script.
