---
title: Footer & Profile
createTime: 2026/08/31 22:40:00
permalink: /en/guide/layout/footer-profile/
---

This guide covers footer customization (`footerConfig.ts`) and the author profile widget (`profileConfig.ts`).

## Footer Custom HTML (footerConfig)

`footerConfig.ts` controls custom HTML, ICP filing numbers, security badges, and uptime counters rendered in the site footer:

```ts title="src/config/footerConfig.ts"
export const footerConfig = withUserConfig("footer", {
  enable: true,
  html: `
    <div class="footer-custom">
      <p>© 2026 Shirone. Built with passion & Astro.</p>
    </div>
  `,
})
```

## Author Profile (profileConfig)

`profileConfig.ts` powers the author avatar card displayed in the primary sidebar:

```ts title="src/config/profileConfig.ts"
export const profileConfig = withUserConfig("profile", {
  avatar: "assets/images/avatar.webp", // Avatar image path
  name: "Shirone",                    // Display name
  bio: "Anime fan & Web Developer",   // Short bio
  links: [
    {
      name: "GitHub",
      icon: "fa6-brands:github",
      url: "https://github.com/your-name",
    },
    {
      name: "Bilibili",
      icon: "fa6-brands:bilibili",
      url: "https://space.bilibili.com/your-uid",
    },
    {
      name: "RSS",
      icon: "fa6-solid:rss",
      url: "/rss.xml",
    },
  ],
})
```

### Avatar Path Rules

- **Local Asset (Recommended)**: Store under `src/assets/images/` and use relative paths like `"assets/images/avatar.webp"` for automated WebP optimization.
- **Public Directory**: Store under `public/` and start with a leading slash `"/avatar.png"`.
- **Remote URL**: Use `"https://cdn.example.com/avatar.webp"`.

### Social Icons

Social icons use [Iconify](https://iconify.design/) naming format (e.g. `fa6-brands:github`, `tabler:brand-twitter`, `ri:mastodon-line`).

## Practical Examples

**Footer with ICP Filing and Uptime Badge**

```ts title="src/config/footerConfig.ts"
export const footerConfig = withUserConfig("footer", {
  enable: true,
  html: `
    <div style="font-size: 0.875rem; opacity: 0.8;">
      <p><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备00000000号</a></p>
      <p>Site running smoothly since 2026</p>
    </div>
  `,
})
```

## FAQ

::: collapse
- Avatar image fails to load

  Check if the file path is correct. Local assets under `src/assets` must not begin with a leading slash, while `public` files must begin with `/`.

- Social icon does not display

  Ensure the Iconify identifier syntax is accurate. Search and verify icon keys on [icon-sets.iconify.design](https://icon-sets.iconify.design/).

- How to disable the author profile widget

  Set `enable: false` for the profile component in `src/config/sidebarConfig.ts`.
:::
