---
title: Comment System
createTime: 2026/09/01 00:13:00
permalink: /en/guide/article/comments/
---

The comment system is disabled globally by default, managed by `commentConfig.ts`. Twikoo is currently supported. Following the zero-overhead principle: when disabled, no external requests are made, no extra DOM is added, and the bundle does not grow.

> [!TIP]
> **Lazy Loading Strategy**
> Keep `lazy: true` enabled by default. Comment scripts load on-demand only when the reader scrolls near the bottom comment section, preserving zero initial bundle overhead.

## Config Overview

```ts title="src/config/commentConfig.ts"
export const commentConfig = withUserConfig("comment", {
  enable: false,        // global switch
  provider: "none",     // "none" | "twikoo"
  lazy: true,           // viewport lazy loading
  twikoo: {
    envId: "",
    scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.19/dist/twikoo.min.js",
    lang: "auto",
    placeholder: "Share your thoughts...",
  },
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | Global switch; `false` loads no comment scripts or DOM |
| `provider` | `"none"` / `"twikoo"` | `"none"` | Comment provider |
| `lazy` | `boolean` | `true` | Viewport lazy loading: the comment component loads when scrolled into view |
| `twikoo.envId` | `string` | `""` | Twikoo environment ID |
| `twikoo.scriptUrl` | `string` | jsdelivr | Twikoo frontend script URL |
| `twikoo.lang` | `string` | `"auto"` | Comment UI language; `auto` follows the site |
| `twikoo.placeholder` | `string` | English text | Comment input placeholder |

## Enabling Twikoo Comments

::: steps

1. **Deploy a Twikoo server** and obtain the environment ID. Tencent CloudBase, Vercel, Railway, and self-hosted deployments are supported.

2. **Update the config**: set `enable` to `true`, `provider` to `"twikoo"`, and fill in `envId`:

   ```ts title="src/config/commentConfig.ts"
   export const commentConfig = withUserConfig("comment", {
     enable: true,
     provider: "twikoo",
     lazy: true,
     twikoo: {
       envId: "https://your-twikoo.vercel.app",
       scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.19/dist/twikoo.min.js",
       lang: "auto",
       placeholder: "Share your thoughts...",
     },
   })
   ```

3. **Rebuild and deploy**—the comment component appears at the bottom of posts.

:::

## Resolution Rules

The config resolver returns `null` (comments render nothing, zero DOM) in any of these cases:

- `enable` is `false`
- `provider` is `"none"`
- `envId` or `scriptUrl` is empty

The component loads dynamically only when all conditions are met. Combined with `lazy: true`, the comment script is requested only when the reader scrolls to the bottom—first-screen performance is untouched.

## Per-Post Control

Set `comment: false` in a post's frontmatter to disable comments for that post (the global switch must be enabled):

```yaml
---
title: Comments Closed Here
comment: false
---
```

The FAB's jump-to-comments button also produces zero DOM for that post (see [Floating Controls](/en/guide/article/fab/)).

## Practical Examples

**Localized Chinese comments**

```ts title="src/config/commentConfig.ts"
{
  enable: true,
  provider: "twikoo",
  lazy: true,
  twikoo: {
    envId: "https://your-twikoo.vercel.app",
    lang: "zh-CN",
    placeholder: "Be kind and constructive",
  },
}
```

**Self-hosted CDN script**

```ts
twikoo: {
  envId: "…",
  scriptUrl: "https://your-cdn.example.com/twikoo.min.js",
},
```

## FAQ

::: collapse
- The comment component doesn't appear

  Check the resolution rules layer by layer: `enable` → `provider` → non-empty `envId` / `scriptUrl`. Any missing piece silently disables comments (by design, no error).

- Comments slow down the page

  Confirm `lazy: true` (on by default). The script loads only when the comment area enters the viewport.

- What format is envId

  Both work: a full URL (like `https://your-twikoo.vercel.app`, common for Vercel/Railway deployments) or a Tencent CloudBase environment ID string.

- The comment language doesn't match the site

  `twikoo.lang: "auto"` follows the site language. Force a specific value (like `"zh-CN"`) to override.
:::
