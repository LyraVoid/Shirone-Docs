---
title: Site Configuration
createTime: 2026/08/31 22:30:00
permalink: /en/guide/layout/site-config/
---

`siteConfig.ts` is the central configuration file for your blog, controlling site metadata, localization, table of contents, reading progress bar, and favicons.

## Quick Overview

```ts title="src/config/siteConfig.ts"
export const siteConfig = withUserConfig("site", {
  site: "https://shirone.mysqil.com/",
  base: "/",
  title: "Shirone",
  subtitle: "A Material 3 anime blog",
  topAppBar: { contentAlign: "center" },
  lang: "en",
  timeZone: "Asia/Shanghai",
  toc: { enable: true, depth: 2 },
  progressIndicator: { style: "dual" },
  favicon: [],
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `site` | `string` | Demo URL | Official URL used for RSS, Sitemap, and open graph images |
| `base` | `string` | `/` | Subpath prefix for subdirectory deployments |
| `title` | `string` | `Shirone` | Blog title displayed in the navbar and browser tab |
| `subtitle` | `string` | — | Site subtitle used in metadata |
| `topAppBar.contentAlign` | `left` / `center` | `center` | Alignment of navbar title and links on desktop |
| `lang` | `string` | `en` | Interface language code (10 languages supported) |
| `timeZone` | `string` | `Asia/Shanghai` | IANA timezone for post dates and moment timestamps |
| `toc` | `object` | Enabled, depth 2 | Right-hand table of contents for article pages |
| `progressIndicator.style` | `dual` / `single` | `dual` | Top reading progress bar style |
| `favicon` | `array` | `[]` | Custom favicons array |

## Field Details

### site and base

`site` must be set to your official production domain. It is consumed by RSS, Sitemap, and Open Graph cards.

`base` is only modified when deploying to a subdirectory (e.g., `base: "/blog/"` for `https://user.github.io/blog/`). For custom domain root deployments, keep it as `/`.

### Language and Timezone

`lang` controls the UI text language (navigation, buttons, labels). Built-in language files are located in `src/i18n/languages/`.

`timeZone` uses standard IANA timezone identifiers (e.g., `Asia/Shanghai`, `America/New_York`, `UTC`).

### Table of Contents (TOC)

```ts
toc: {
  enable: true,  // Display TOC on article pages
  depth: 2,      // Maximum heading depth (1-3)
},
```

`depth: 2` includes `h1` and `h2` headings. For long technical articles, setting `depth: 3` includes `h3`.

### Reading Progress Indicator

```ts
progressIndicator: {
  style: "dual",   // "dual" dual-scan line | "single" single-scan line
},
```

### Favicon

```ts
favicon: [
  {
    src: "/favicon/icon.png",   // Path relative to /public
    theme: "light",             // Optional: light / dark
    sizes: "32x32",             // Optional size
  },
],
```

Keeping the array empty `[]` uses the default theme icons.

## Behavior vs Content Principle

Shirone maintains a clear distinction between `src/config/` and `src/data/`:

| Question | Category | Location |
| --- | --- | --- |
| Controls page visibility, sorting, credentials, and feature switches? | **Config** | `src/config/*Config.ts` |
| Contains actual content items, descriptions, and lists? | **Data** | `src/data/*.ts` |

For example, whether the timeline page is enabled is configured in `timelineConfig.enable` (Config), while timeline milestones are written in `src/data/timeline.ts` (Data).

::: tip Zero Overhead Contract
Optional external integrations are disabled by default (`enable: false`). When disabled, they produce zero external requests, zero DOM footprint, and zero main bundle bloat.
:::
