---
title: Site Configuration
createTime: 2026/08/31 22:30:00
permalink: /en/guide/layout/site-config/
---

`siteConfig.ts` is the core configuration entry for your site, controlling site identity, language and timezone, table of contents, reading progress bar, favicon, and other foundational capabilities. This guide covers basic fields—dynamic theme coloring and banners have dedicated guides ([Dynamic Theme Color](/en/guide/layout/theme-color/), [Banner & Background](/en/guide/layout/banner/)).

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
| `site` | `string` | Demo site URL | Official site URL, affects RSS, Sitemap, and OG images |
| `base` | `string` | `/` | Subdirectory deployment prefix |
| `title` | `string` | `Shirone` | Site title displayed in top app bar and browser tabs |
| `subtitle` | `string` | — | Site subtitle used in metadata |
| `topAppBar.contentAlign` | `left` / `center` | `center` | Desktop top app bar title and navigation alignment |
| `lang` | `string` | `en` | UI language code, e.g. `zh_CN`, `ja` (10 built-in languages) |
| `timeZone` | `string` | `Asia/Shanghai` | IANA timezone, controls timestamp formatting |
| `toc` | `object` | Enabled, depth 2 | Right-side table of contents for article pages |
| `progressIndicator.style` | `dual` / `single` | `dual` | Reading progress bar style at the top |
| `favicon` | `array` | `[]` | Custom site icons array, empty array uses theme default |

## Detailed Reference

### site and base

`site` ==must be configured with your official domain before deployment==. It is consumed by RSS feeds, Sitemap generators, and Open Graph social sharing cards. Incorrect values will cause subscriber and sharing links to point to invalid URLs.

`base` is only modified when deploying to a subdirectory (such as `https://user.github.io/blog/` corresponding to `base: "/blog/"`). For standard root custom domains, keep it as `/`. See [Deploy to GitHub Pages](/en/guide/deploy/github/) for details.

### Language and Timezone

`lang` controls the UI text language (navigation links, buttons, action hints), independent of the language of your written articles. Available values are listed in `src/i18n/languages/`, with 10 built-in languages including English, Simplified Chinese, Traditional Chinese, Japanese, and more.

`timeZone` uses standard IANA timezone format (such as `Asia/Shanghai`, `America/New_York`, `UTC`), decoupled from `lang`—meaning you can display an English interface with timestamps formatted to Shanghai time.

### Table of Contents (TOC)

```ts
toc: {
  enable: true,  // Display TOC sidebar on article pages
  depth: 2,      // Maximum heading depth, range 1~3
},
```

`depth: 2` captures `h1` and `h2` headings. For comprehensive technical articles, `depth: 3` is recommended (capturing up to h3).

### Reading Progress Indicator

```ts
progressIndicator: {
  style: "dual",   // "dual" dual-scan line / "single" single-scan line
},
```

The progress indicator renders at the top of the viewport and updates continuously as the visitor scrolls through the content.

### favicon

```ts
favicon: [
  {
    src: "/favicon/icon.png",   // Relative to /public directory
    theme: "light",             // Optional: light / dark
    sizes: "32x32",             // Optional icon dimension
  },
],
```

Leaving this as an empty array `[]` uses the theme default icon assets.

## Configuration and Data Separation Principle

Shirone enforces a strict separation of concerns between `src/config/` and `src/data/`:

| Question | Domain | File Location |
| --- | --- | --- |
| Controls page activation, ordering, switches, credentials? | **Config** | `src/config/*Config.ts` |
| Contains actual items, copy, milestones, entries? | **Data** | `src/data/*.ts` |

For example, whether the timeline page is displayed is defined in `timelineConfig.enable` (Config), while timeline milestone entries are maintained in `src/data/timeline.ts` (Data). Deactivating individual items is done declaratively via `disabledKeys` in Config, keeping Data pure and decoupled.

::: tip Zero-Overhead Principle
Optional external integrations and heavy feature modules are disabled by default (==`enable: false`==). When disabled, they guarantee zero external network requests, zero placeholder DOM nodes, zero runtime performance degradation, and zero bundle bloat.
:::

## Practical Examples

**Minimal Configuration (Personal Blog Starter)**

```ts title="src/config/siteConfig.ts"
export const siteConfig = withUserConfig("site", {
  site: "https://blog.example.com/",
  base: "/",
  title: "My Blog",
  subtitle: "Recording and Sharing",
  lang: "en",
  timeZone: "America/New_York",
})
```

Unlisted fields (toc, progressIndicator, etc.) automatically fallback to type-safe theme defaults.

**Content Repository Override (Dual-Repo Mode)**

Create `config/site.yaml` in your content repository with only the keys you wish to override:

```yaml title="config/site.yaml (Content Repo)"
site: https://blog.example.com/
title: My Blog
lang: en
```

YAML keys are deeply merged with TypeScript code defaults (objects recursively merged, arrays replaced as a whole).

## FAQ

::: collapse
- Type error during build after modifying configuration
  Shirone uses strict type checking. Invalid field names or unexpected values will trigger immediate build-time errors. Cross-reference type definitions in `src/types/config.ts` or run `npx astro check` to validate changes.

- Language changed but some copy remains unchanged
  UI strings rely on the i18n translation dictionary. Custom strings (such as banner subtitles or announcement text) are static plaintext and do not auto-translate with `lang`.

- Where do title and subtitle appear
  `title` renders in the top app bar and browser document title; `subtitle` is primarily used for SEO metadata and social previews. The hero heading displayed in the center of the homepage banner is `banner.homeText.title` (see [Banner & Background](/en/guide/layout/banner/)), which is configured independently.
:::
