---
title: Custom Fonts
createTime: 2026/08/31 22:36:00
permalink: /en/guide/layout/font/
---

`fontConfig.ts` manages typography across your entire site. Shirone divides fonts into three semantic roles (body Latin, CJK, and monospace), supporting both system font and custom font modes, three font sources, and automated production subsetting that reduces multi-megabyte CJK fonts down to several hundred kilobytes.

## Three Font Roles

| Role | Responsibility | CSS Variable |
| --- | --- | --- |
| `body` | Latin text and standard prose (letters, digits, punctuation) | `--font-body` |
| `cjk` | East Asian glyphs (Chinese characters, Japanese Kana, Korean Hangul) | `--font-cjk` |
| `mono` | Monospace code typography (code blocks, inline code, terminal) | `--font-mono` |

Default font pairing: **Outfit** (modern geometric Latin) + **Yozai Medium** (full CJK glyphs) + **JetBrains Mono** (code).

## Build Modes

```ts title="src/config/fontConfig.ts"
export const fontConfig = withUserConfig("font", {
  mode: "custom",       // "custom" custom fonts | "system" pure system fonts
  fontFamilies: [ /* Font definitions */ ],
  subsetting: { ... },
  budget: { ... },
})
```

| mode | Behavior | Recommended Use Case |
| --- | --- | --- |
| `"custom"` | Bundles and subsets fonts defined in `fontFamilies` | Custom curated typography (default) |
| `"system"` | Zero font files bundled; uses client device system fonts | Maximum performance, zero font bandwidth |

**Zero-Asset System Font Setup**

```ts
mode: "system",
fontFamilies: [],
```

## Font Sources

Each font item specifies its distribution source via `source`:

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

Place `.woff2` or `.ttf` files under `src/assets/fonts/`. `file` is relative to project root, and `family` matches the true font family name.

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

Install the npm package (`pnpm add @fontsource/outfit`) and specify the package CSS path.

### Configuration Fields

| Field | Description |
| --- | --- |
| `id` | Unique entry identifier |
| `family` | True CSS font-family name |
| `role` | Semantic role: `body`, `cjk`, or `mono` |
| `variants` | Array of font weights and style variants |
| `fallback` | Fallback font stack |
| `display` | Font loading strategy (default `swap`) |
| `preload` | HTML link preload tag (recommend `false` for large CJK fonts) |

## Automated Font Subsetting (subsetting)

Production builds extract only glyphs actually present in content, generating a minimal `.woff2` subset:

```ts
subsetting: {
  enable: true,          // Automated subsetting switch
  includeContent: true,  // Scans all articles under src/content/
  includeI18n: true,     // Scans all 10 language dictionaries
  includeConfig: true,   // Scans site configuration and navbar titles
  includeCommon: true,   // Includes common punctuation and ASCII glyphs
  allowRemoteText: true, // Fetches remote Meting music playlist titles for glyph extraction
},
```

- **Dev Environment**: Loads full unsubsetted fonts for instantaneous hot module replacement.
- **Production Build**: Compresses massive fonts into a compact ~300KB - 1MB payload.

> [!WARNING]
> **Rebuild Required on New Content**
> Font subsets are generated at build time. Publishing new articles requires running `pnpm build` to include newly introduced glyphs in the font bundle.

## Size Budget (budget)

```ts
budget: {
  maxTotalBytes: 6 * 1024 * 1024,  // Total custom font budget: 6MB
  maxFamilyBytes: 4 * 1024 * 1024, // Single font family budget: 4MB
},
```

`pnpm fonts:check` validates that font bundles stay strictly within performance thresholds.

## Validation Commands

```bash
npx astro check   # Validate configuration and templates
pnpm build        # Execute production build and font subsetting
pnpm fonts:check  # Audit font formats and size budgets
```

## Practical Examples

**Switching to LXGW WenKai Screen as CJK Font**

```ts title="src/config/fontConfig.ts"
fontFamilies: [
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
  },
  {
    id: "lxgw-cjk",
    family: "LXGW WenKai Screen",
    role: "cjk",
    source: "local",
    variants: [
      { file: "src/assets/fonts/LXGWWenKaiScreen.woff2", weight: 400, style: "normal" },
    ],
    fallback: ["system-ui", "sans-serif"],
  },
  {
    id: "jetbrains-mono",
    family: "JetBrains Mono",
    role: "mono",
    source: "fontsource",
    variants: [
      { file: "@fontsource/jetbrains-mono/400.css", weight: 400, style: "normal" },
    ],
    fallback: ["ui-monospace", "monospace"],
  },
]
```

## FAQ

::: collapse
- Font displays fallback font after publishing new post
  Run `pnpm build` so the subsetting engine extracts the newly introduced characters and updates the `.woff2` font bundle.

- Subsetting build time is long
  Subsetting scans content and remote Meting playlists during build. If network is constrained, set `allowRemoteText: false` to speed up local builds.

- How to add custom weights
  Add items to the `variants` array specifying `weight: 700` and pointing to the respective weight CSS or font file.
:::
