---
title: Article Page Config
createTime: 2026/09/01 00:10:00
permalink: /en/guide/article/article-config/
---

`articleConfig.ts` controls three tail blocks of the post detail page: the last-updated notice, further reading, and the share poster. All blocks follow the zero-overhead principle—when disabled, no DOM is rendered, no data is computed, and no client scripts are loaded.

## Config Overview

```ts title="src/config/articleConfig.ts"
export const articleConfig = withUserConfig("article", {
  lastUpdated: {
    enable: true,
    minimumAgeDays: 90,
  },
  discovery: {
    enable: true,
    related: { enable: true, count: 3 },
    random: { enable: true, count: 2 },
  },
  share: {
    enable: true,
    includeCover: true,
  },
})
```

## Last Updated Notice (lastUpdated)

```ts
lastUpdated: {
  enable: true,
  minimumAgeDays: 90,
},
```

When the gap between a post's `updated` field and its publish date reaches `minimumAgeDays` (counted in UTC calendar days, shown on the day the threshold is met), a "content may be outdated" notice appears at the top of the post. Set it to `0` to show the notice immediately whenever `updated` is present.

::: tip Prerequisite
The notice only has a chance to trigger when the post's frontmatter contains an `updated` field—posts without `updated` never show it.
:::

## Further Reading (discovery)

The recommendation block at the end of a post, in two groups:

```ts
discovery: {
  enable: true,                       // master switch: no computation or rendering when off
  related: {
    enable: true,                     // related: shares at least one tag or category
    count: 3,
  },
  random: {
    enable: true,                     // random: stable sampling by post identity
    count: 2,
  },
},
```

| Item | Rule |
| --- | --- |
| `related` | Only shows posts sharing at least one tag or category with the current post |
| `random` | Samples across all posts; sampling is based on the post identity and is **stable**—results don't change on refresh within the same build |

The count cap is **6** (`normalizeDiscoveryCount` clamps to 0–6 and floors); the block renders only when the two counts sum above 0.

**Disabling one group**: set `related.enable: false` (keep random only) or `random.enable: false` (keep related only); turning both off removes the entire block.

## Share Poster (share)

```ts
share: {
  enable: true,       // master switch for the share block
  includeCover: true, // include the post cover in the poster by default
},
```

- When disabled, the share block is not rendered and no client hydration is introduced
- With `includeCover: true`, the generated poster includes the post cover; when the cover is unavailable it degrades gracefully to a cover-less layout

## Per-Post Overrides

The values above are site-wide defaults. Per-post control happens via frontmatter:

- `updated`: the data source for the last-updated notice
- `comment: false`: disable comments for a single post

## Practical Examples

**Content blog (defaults + more related posts)**

```ts
discovery: {
  enable: true,
  related: { enable: true, count: 4 },
  random: { enable: true, count: 2 },
},
```

**Essay site (keep share only)**

```ts
lastUpdated: { enable: false, minimumAgeDays: 90 },
discovery: { enable: false },
share: { enable: true, includeCover: true },
```

**Privacy first (everything off)**

```ts
lastUpdated: { enable: false, minimumAgeDays: 90 },
discovery: { enable: false },
share: { enable: false, includeCover: false },
```

## FAQ

::: collapse
- Recommendations look irrelevant
  `related` matches on tag/category overlap. Check whether the `tags` / `category` in your posts are too broad (e.g. one shared "Essays" category sitewide)—refining them improves recommendation quality significantly.

- Do random posts change on every refresh
  No. Sampling is based on the post identity and stays stable within a build; results may change only after a rebuild.

- Why doesn't the update notice appear
  Check in order: does the post have `updated` → does the age gap reach `minimumAgeDays` → is `lastUpdated.enable` off.
:::
