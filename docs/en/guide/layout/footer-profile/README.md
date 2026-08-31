---
title: Footer & Profile
createTime: 2026/08/31 22:35:00
permalink: /en/guide/layout/footer-profile/
---

`footerConfig.ts` controls custom HTML injection into the site footer, while `profileConfig.ts` defines avatar, author name, biography, and social links.

## Footer Custom HTML (footerConfig)

```ts title="src/config/footerConfig.ts"
export const footerConfig = withUserConfig("footer", {
  enable: false,
})
```

- When enabled, reads `src/config/FooterConfig.html` and injects its contents above the copyright section.
- When disabled, produces zero DOM nodes and zero runtime overhead.

### Usage Steps

::: steps

1. Create `src/config/FooterConfig.html` with your custom HTML markup:

   ```html title="src/config/FooterConfig.html"
   <div style="text-align: center; margin-bottom: 8px;">
     <span>Powered by <a href="https://astro.build/">Astro</a></span>
     ·
     <a href="/rss.xml">RSS Feed</a>
   </div>
   ```

2. Set `footerConfig.enable: true`.

3. Rebuild to view injected content in the footer.

:::

## Author Profile (profileConfig)

```ts title="src/config/profileConfig.ts"
export const profileConfig = withUserConfig("profile", {
  avatar: "assets/images/demo-avatar.webp",
  name: "Shirone",
  bio: "The rain remembers what the sky forgot to say.",
  links: [
    {
      name: "Twitter",
      icon: "fa6-brands:twitter",
      url: "https://twitter.com",
    },
    {
      name: "Steam",
      icon: "fa6-brands:steam",
      url: "https://store.steampowered.com",
    },
    {
      name: "GitHub",
      icon: "fa6-brands:github",
      url: "https://github.com/LyraVoid/Shirone",
    },
  ],
})
```

| Field | Type | Description |
| --- | --- | --- |
| `avatar` | `string` | Avatar image path (relative to `src` or `/public`) |
| `name` | `string` | Author name displayed on sidebar profile and RSS metadata |
| `bio` | `string` | Short personal bio |
| `links` | `array` | Social links array |

### Avatar Path Conventions

- `assets/images/avatar.webp` — Relative to `src/` (processed and optimized during build).
- `/avatar.png` — Leading slash relative to `/public` (served raw).

### Social Links

Icons use Iconify naming conventions (from [icones.js.org](https://icones.js.org/)). Additional icon sets can be installed via `pnpm add @iconify-json/<icon-set-name>`.
