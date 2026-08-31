---
title: LLM-Friendly Content
createTime: 2026/09/01 00:53:00
permalink: /en/guide/features/llms/
---

Shirone ships a built-in AI-friendly content system following the [llmstxt.org](https://llmstxt.org/) spec: it auto-generates `/llms.txt` (structured index) and `/llms-full.txt` (full-content compilation) at build time, letting LLMs and AI Agents (ChatGPT, Claude, Perplexity, Cursor, etc.) understand your site efficiently. The client JS bundle grows by 0 KB—zero impact on readers.

## Generation Mechanism

Everything happens at build time—**no manual registry to maintain while writing**:

1. **Post collection**: scans all public posts, extracting titles, links, summaries, and tags
2. **Site info**: title, subtitle, and summary are inherited from `siteConfig` and `profileConfig`
3. **Body cleaning**: `/llms-full.txt` expands `<llm-only>` AI-specific hints and strips `<llm-exclude>` content
4. **Security isolation**: encrypted posts (`encrypted: true`) and drafts (`draft: true`) are always filtered out

## Configuration

```ts title="src/config/llmsConfig.ts"
export const llmsConfig = withUserConfig("llms", {
  enable: true,              // endpoint master switch
  generateFull: true,        // generate /llms-full.txt as well
  siteSummary: "",           // site intro seen by LLMs (may stay empty)
  descriptionMaxLength: 200, // per-post summary cap in the index
  excludeTags: ["secret", "private"],   // sensitive tag blacklist
  excludeCategories: [],     // sensitive category blacklist
  corePages: [ /* core guide pages */ ],
  customSections: [],        // custom extension sections
})
```

## Field Reference

| Field | Default | Description |
| --- | --- | --- |
| `enable` | `true` | `false` disables entirely—links return 404, no build files |
| `generateFull` | `true` | `false` generates only the `/llms.txt` index, skipping the full dump (recommended for very large blogs) |
| `siteSummary` | `""` | Site intro; empty falls back to `siteConfig.subtitle` or `profileConfig.bio` |
| `descriptionMaxLength` | `200` | Summary truncation cap in the index; doesn't affect the full body |
| `excludeTags` | `["secret", "private"]` | Posts hitting any tag are stripped from both endpoints (even if public) |
| `excludeCategories` | `[]` | Posts in these categories are excluded entirely |
| `corePages` | Three defaults | Core sections introduced to the AI; empty array uses defaults |
| `customSections` | `[]` | Custom sections (external projects, API docs, etc.) |

## Common Scenarios

**Use defaults (recommended)**

Keep the defaults—all public posts are collected automatically, zero maintenance.

**Huge blog, index only**

```ts
generateFull: false,
```

**Protect sensitive tags**

```ts
excludeTags: ["secret", "private", "diary"],
```

**Add custom sections**

```ts
customSections: [
  {
    title: "Open Source Projects",
    description: "Featured repositories maintained by the author.",
    items: [
      { title: "Shirone Theme", url: "https://github.com/LyraVoid/Shirone",
        description: "M3E blog theme for Astro." },
    ],
  },
],
```

## Dual-Repo Override

In the content repo, `config/llms.yaml` only needs the keys you want to change (like `siteSummary`, `excludeTags`); merging is "recursive object merge, whole-array replacement"—so changing `corePages` / `customSections` requires writing the full list.

## Verification

Check the build output:

```text
dist/llms.txt         # structured index
dist/llms-full.txt    # full-content compilation (when generateFull: true)
```

Try it: paste "Read https://your-site.com/llms.txt and summarize this site" into ChatGPT/Claude.

## FAQ

**Could private content leak to AI**

No. Encrypted posts and drafts are filtered at build time; public posts hitting `excludeTags` / `excludeCategories` are stripped too. Note: **public posts that are neither encrypted nor blacklisted are accessible to anyone anyway**—the LLM endpoint just offers a more structured way to read them.

**Does llms.txt update when posts change**

Yes. Both endpoints are statically generated at build time and rebuilt with every build.

**Does it slow builds or affect readers**

No. It's pure server-side static text generation—0 KB added to the client bundle and zero impact on readers.