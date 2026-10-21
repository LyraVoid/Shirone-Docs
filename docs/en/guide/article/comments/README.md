---
title: Comment System
createTime: 2026/09/01 00:13:00
permalink: /en/guide/article/comments/
---

The comment system is disabled globally by default, managed by `commentConfig.ts`. Three providers are supported: **Twikoo** (self-hosted or managed backend), **Giscus** (zero-backend, built on GitHub Discussions) and **Waline** (self-hosted or managed server, with anonymous comments, login, emoji and article reactions). Following the zero-overhead principle: when disabled, no external requests are made, no extra DOM is added, and the bundle does not grow.

> [!TIP]
> **Lazy Loading Strategy**
> Keep `lazy: true` enabled by default. Comment scripts load on-demand only when the reader scrolls near the bottom comment section, preserving zero initial bundle overhead.

## Config Overview

```ts title="src/config/commentConfig.ts"
export const commentConfig = withUserConfig("comment", {
  enable: false,        // global switch
  provider: "none",     // "none" | "twikoo" | "giscus" | "waline"
  lazy: true,           // viewport lazy loading
  twikoo: {
    envId: "",
    scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.20/dist/twikoo.min.js",
    lang: "auto",
    placeholder: "Share your thoughts...",
  },
  giscus: {
    repo: "",
    repoId: "",
    category: "Announcements",
    categoryId: "",
    mapping: "pathname",
    strict: false,
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: "bottom",
    theme: { light: "light", dark: "dark" },
    lang: "auto",
    scriptUrl: "https://giscus.app/client.js",
  },
  waline: {
    serverURL: "",
    scriptUrl: "https://cdn.jsdelivr.net/npm/@waline/client@3.16.1/dist/waline.umd.js",
    styleUrl: "https://cdn.jsdelivr.net/npm/@waline/client@3.16.1/dist/waline.css",
    lang: "auto",
    locale: { placeholder: "Share your thoughts..." },
    emoji: true,
    commentSorting: "latest",
    meta: ["nick", "mail", "link"],
    requiredMeta: [],
    login: "enable",
    wordLimit: 0,
    pageSize: 10,
    imageUploader: true,
    highlighter: true,
    texRenderer: false,
    noCopyright: false,
    noRss: true,
    recaptchaV3Key: "",
    turnstileKey: "",
    reaction: true,
  },
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | Global switch; `false` loads no comment scripts or DOM |
| `provider` | `"none"` / `"twikoo"` / `"giscus"` / `"waline"` | `"none"` | Comment provider |
| `lazy` | `boolean` | `true` | Viewport lazy loading: the comment component loads when scrolled into view |
| `twikoo.envId` | `string` | `""` | Twikoo environment ID |
| `twikoo.scriptUrl` | `string` | jsdelivr | Twikoo frontend script URL |
| `twikoo.lang` | `string` | `"auto"` | Comment UI language; `auto` follows the site |
| `twikoo.placeholder` | `string` | English text | Comment input placeholder |
| `giscus.repo` | `string` | `""` | Public repository in `owner/repo` format (required) |
| `giscus.repoId` | `string` | `""` | Repository ID from giscus.app (required) |
| `giscus.categoryId` | `string` | `""` | Category ID from giscus.app (required) |
| `giscus.category` | `string` | `"Announcements"` | Discussion category name; Announcements recommended |
| `giscus.mapping` | enum | `"pathname"` | Page-to-discussion mapping: `pathname` / `url` / `title` / `og:title` / `specific` / `number` |
| `giscus.strict` | `boolean` | `false` | Strict title matching (SHA-1) against fuzzy-search mismatches |
| `giscus.reactionsEnabled` | `boolean` | `true` | Show reactions on the main post |
| `giscus.emitMetadata` | `boolean` | `false` | Emit discussion metadata to the page |
| `giscus.inputPosition` | `"top"` / `"bottom"` | `"bottom"` | Comment input position |
| `giscus.theme.light` / `.dark` | `string` | `"light"` / `"dark"` | Light/dark themes (giscus theme keys or custom CSS URLs), synced with the site |
| `giscus.lang` | `string` | `"auto"` | Comment language; `auto` follows the site |
| `giscus.scriptUrl` | `string` | giscus.app | client.js URL; replace when self-hosting giscus |
| `waline.serverURL` | `string` | `""` | Waline server http(s) URL (required) |
| `waline.scriptUrl` / `.styleUrl` | `string` | jsdelivr | Client JS and CSS URLs, loaded when the section enters the viewport; keep the same version when self-hosting or upgrading |
| `waline.lang` | `string` | `"auto"` | Comment language; `auto` follows the post/site language (unsupported languages fall back to `en`), or a Waline code such as `zh-CN`, `jp` |
| `waline.locale` | object | `{ placeholder }` | Text overrides; omitted keys keep Waline's defaults for the current language. `placeholder` is the input hint |
| `waline.emoji` | `boolean` / array | `true` | `true` uses Waline's default pack, `false` disables; a list of pack URLs also works |
| `waline.commentSorting` | `"latest"` / `"oldest"` / `"hottest"` | `"latest"` | Comment sorting |
| `waline.meta` / `.requiredMeta` | array | `["nick","mail","link"]` / `[]` | Commenter info fields and which are required; an empty `requiredMeta` allows anonymous comments |
| `waline.login` | `"enable"` / `"disable"` / `"force"` | `"enable"` | Login mode |
| `waline.wordLimit` | `number` / `[min, max]` | `0` | Word limit; `0` for unlimited |
| `waline.pageSize` | `number` | `10` | Comments per page |
| `waline.imageUploader` / `.highlighter` / `.texRenderer` | `boolean` | `true` / `true` / `false` | Image upload (Base64), code highlighting and the TeX hint; booleans only |
| `waline.noCopyright` / `.noRss` | `boolean` | `false` / `true` | Hide the footer copyright / RSS subscription links |
| `waline.recaptchaV3Key` / `.turnstileKey` | `string` | `""` | Captcha site keys; empty disables |
| `waline.reaction` | `boolean` / array | `true` | Article reactions; a list of custom image URLs also works |

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
       scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.20/dist/twikoo.min.js",
       lang: "auto",
       placeholder: "Share your thoughts...",
     },
   })
   ```

3. **Rebuild and deploy**—the comment component appears at the bottom of posts.

:::

## Enabling Giscus Comments

Giscus is built on GitHub Discussions: no backend deployment, with comments stored in your own public repository.

::: steps

1. **Prepare the repository**: create a public GitHub repository, enable Discussions under Settings → General → Features, then install the [giscus App](https://github.com/apps/giscus) and grant it access.

2. **Retrieve the IDs**: open [giscus.app](https://giscus.app), pick the repository and a Discussion category (**Announcements** recommended—only maintainers can open discussions), and note down the generated `data-repo-id` and `data-category-id`.

3. **Update the config**: set `enable` to `true`, `provider` to `"giscus"`, and fill in the three required fields:

   ```ts title="src/config/commentConfig.ts"
   export const commentConfig = withUserConfig("comment", {
     enable: true,
     provider: "giscus",
     lazy: true,
     giscus: {
       repo: "owner/repo",
       repoId: "R_xxxxxxxxxx",
       categoryId: "DIC_xxxxxxxxxx",
       // optional: themes follow the site's light/dark mode automatically
       theme: { light: "light", dark: "transparent_dark" },
     },
   })
   ```

4. **Rebuild and deploy**—the Giscus comment section appears at the bottom of posts, and its theme syncs with the site's light/dark mode.

:::

## Enabling Waline Comments

Waline's comment section follows the outlined style the theme uses for Twikoo, emoji in the comment box render as icons, and article reactions appear at the top of the section.

::: steps

1. **Deploy a Waline server** according to the [Waline documentation](https://waline.js.org/guide/get-started/) (Vercel, Deta, Railway, or self-hosted), and note down the server URL.

2. **Update the config**: set `enable` to `true`, `provider` to `"waline"`, and fill in `serverURL`:

   ```ts title="src/config/commentConfig.ts"
   export const commentConfig = withUserConfig("comment", {
     enable: true,
     provider: "waline",
     lazy: true,
     waline: {
       serverURL: "https://comments.example.com",
       lang: "auto",
       locale: { placeholder: "Share your thoughts..." },
       // optional: require a nickname and an email
       requiredMeta: ["nick", "mail"],
     },
   })
   ```

3. **Rebuild and deploy**—the Waline comment section appears at the bottom of posts; its client JS and CSS load only when the section enters the viewport.

:::

> [!NOTE]
> Options reach the browser as JSON, so `imageUploader`, `highlighter` and `texRenderer` accept only `true` / `false`; Waline's custom functions fail the build. Page views are never collected (Waline's `pageview` stays off). When self-hosting the client or upgrading, keep `scriptUrl` and `styleUrl` on the same version.

## Resolution Rules

The config resolver returns `null` (comments render nothing, zero DOM) in any of these cases:

- `enable` is `false`
- `provider` is `"none"`
- provider is `"twikoo"`: `envId` or `scriptUrl` is empty
- provider is `"giscus"`: any of `repo`, `repoId`, `categoryId` is empty
- provider is `"waline"`: any of `serverURL`, `scriptUrl`, `styleUrl` is empty, or `serverURL` is not an http(s) URL

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

**Zero-backend GitHub comments**

```ts title="src/config/commentConfig.ts"
{
  enable: true,
  provider: "giscus",
  lazy: true,
  giscus: {
    repo: "owner/repo",
    repoId: "R_xxxxxxxxxx",
    categoryId: "DIC_xxxxxxxxxx",
    mapping: "pathname",
    lang: "auto",
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

**Waline with verified commenters**

```ts title="src/config/commentConfig.ts"
{
  enable: true,
  provider: "waline",
  lazy: true,
  waline: {
    serverURL: "https://comments.example.com",
    login: "force",
    requiredMeta: ["nick", "mail"],
    wordLimit: [0, 500],
    turnstileKey: "0x4AAAAAAA…",
  },
}
```

## FAQ

::: collapse
- The comment component doesn't appear

  Check the resolution rules layer by layer: `enable` → `provider` → required fields (twikoo: `envId` / `scriptUrl`; giscus: `repo` / `repoId` / `categoryId`; waline: `serverURL` / `scriptUrl` / `styleUrl`, with `serverURL` an http(s) URL). Any missing piece silently disables comments (by design, no error).

- Comments slow down the page

  Confirm `lazy: true` (on by default). The script loads only when the comment area enters the viewport.

- What format is envId

  Both work: a full URL (like `https://your-twikoo.vercel.app`, common for Vercel/Railway deployments) or a Tencent CloudBase environment ID string.

- Where do I find the Giscus repoId / categoryId

  Open [giscus.app](https://giscus.app), select your repository and category; the generated `<script>` tag contains both `data-repo-id` and `data-category-id`.

- The comment language doesn't match the site

  `twikoo.lang`, `giscus.lang` or `waline.lang: "auto"` follows the site language. Force a specific value (like `"zh-CN"`) to override. Waline spells Japanese as `"jp"`, and a site language outside its built-in list falls back to English.

- Can Waline use a custom image uploader or highlighter

  No. Options are written into the page as JSON, which cannot carry functions, so `imageUploader`, `highlighter` and `texRenderer` accept only `true` / `false`; a function fails the build instead of silently doing nothing.
:::
