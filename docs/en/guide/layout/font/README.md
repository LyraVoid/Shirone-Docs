---
title: Custom Fonts
createTime: 2026/08/31 22:36:00
permalink: /en/guide/layout/font/
---

`fontConfig.ts` manages site-wide typography. Shirone divides fonts into three semantic roles (body Latin, CJK, and monospace), supporting both system font and custom font modes, multiple font sources, and automated production-build subsetting.

## Three Font Roles

| Role | Responsibility | CSS Variable |
| --- | --- | --- |
| `body` | Latin text, numbers, and basic punctuation | `--font-body` |
| `cjk` | Chinese, Japanese, and Korean glyphs | `--font-cjk` |
| `mono` | Monospace code blocks and terminal outputs | `--font-mono` |

Default theme combination: **Outfit** (geometric Latin) + **Yozai Medium** (comprehensive CJK) + **JetBrains Mono** (code).

## Build Modes

```ts title="src/config/fontConfig.ts"
export const fontConfig = withUserConfig("font", {
  mode: "custom",       // "custom" | "system"
  fontFamilies: [ /* font entries */ ],
  subsetting: { ... },
  budget: { ... },
})
```

- `"custom"`: Packages fonts declared in `fontFamilies` (default).
- `"system"`: Zero font bundling, relying entirely on visitor operating system fonts.

## Font Sources

### Local Font Files (local)

```ts
{
  id: "yozai-cjk",
  family: "Yozai Medium",
  role: "cjk",
  source: "local",
  variants: [
    { file: "src/assets/fonts/Yozai-Medium.ttf", weight: 500, style: "normal" },
  ],
  fallback: ["system-ui", "sans-serif"],
  display: "swap",
  preload: false,
}
```

### Fontsource Packages (fontsource)

```ts
{
  id: "outfit-body",
  family: "Outfit",
  role: "body",
  source: "fontsource",
  variants: [
    { file: "@fontsource/outfit/400.css", weight: 400, style: "normal" },
    { file: "@fontsource/outfit/700.css", weight: 700, style: "normal" },
  ],
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
}
```

## Automated Font Subsetting (subsetting)

Production builds automatically scan article contents, i18n dictionaries, and configuration files to extract used glyphs into compact `.woff2` files:

```ts
subsetting: {
  enable: true,          // Automated subsetting toggle
  includeContent: true,  // Scan posts under src/content/
  includeI18n: true,     // Scan all 10 language dictionaries
  includeConfig: true,   // Scan site config and navigation
  includeCommon: true,   // Include standard punctuation
  allowRemoteText: true, // Fetch Meting track titles for glyph extraction
},
```

- **Development (`pnpm dev`)**: Full font files loaded for immediate preview of any newly typed character.
- **Production (`pnpm build`)**: Strips unused glyphs, reducing multi-megabyte CJK fonts down to hundreds of kilobytes.

## Size Budget (budget)

```ts
budget: {
  maxTotalBytes: 6 * 1024 * 1024,  // Total custom font budget: 6MB
  maxFamilyBytes: 4 * 1024 * 1024, // Per-family budget: 4MB
},
```
