---
title: Copyright & License
createTime: 2026/09/01 00:12:00
permalink: /en/guide/article/copyright/
---

The License block at the bottom of the post page is configured by `licenseConfig.ts`, showing the article's license and a link to its full text.

## Configuration

```ts title="src/config/licenseConfig.ts"
export const licenseConfig = withUserConfig("license", {
  enable: true,
  name: "CC BY-NC-SA 4.0",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | Whether to show the license block |
| `name` | `string` | `CC BY-NC-SA 4.0` | License name displayed in the post page License block |
| `url` | `string` | Official CC link | Full license text; the name links here |

## Common License Choices

| License | Use case |
| --- | --- |
| `CC BY-NC-SA 4.0` | Default. Attribution-NonCommercial-ShareAlike: credit required, no commercial use, derivatives under the same license |
| `CC BY 4.0` | Attribution only, including commercial use—the most permissive |
| `CC BY-NC 4.0` | Attribution + non-commercial |
| `CC BY-NC-ND 4.0` | Strictest: attribution + non-commercial + no derivatives |
| `All Rights Reserved` | All rights reserved; no redistribution without permission |

Example change (to the permissive CC BY 4.0):

```ts title="src/config/licenseConfig.ts"
export const licenseConfig = withUserConfig("license", {
  enable: true,
  name: "CC BY 4.0",
  url: "https://creativecommons.org/licenses/by/4.0/",
})
```

## How It Works with Your Profile

The License block, `profileConfig` (author name), and the post's publish/update times together form the byline area of a post page. Disabling the License block does not affect other parts of the page.

::: tip Content-Repo Override
The license is a typical site-level behavior setting. In dual-repo mode, override it via `config/license.yaml` in your content repository—no theme source edits needed.

```yaml title="config/license.yaml (content repo)"
enable: true
name: CC BY 4.0
url: https://creativecommons.org/licenses/by/4.0/
```
:::

## FAQ

::: collapse
- Can each post use a different license

  `licenseConfig` is site-wide. For occasional exceptions, append a note at the end of the post body, or add it via `FooterConfig.html`.

- The block shows but the link is broken

  Check that `url` is complete (including `https://`). Keep the license name and link consistent—readers verify terms through that link.
:::
