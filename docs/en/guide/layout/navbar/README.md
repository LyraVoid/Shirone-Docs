---
title: Navbar Configuration
createTime: 2026/08/31 22:38:00
permalink: /en/guide/layout/navbar/
---

`navbarConfig.ts` configures the top application bar, preset navigation entries, and custom navigation menus.

## Presets Table (LinkPresets)

Shirone provides type-safe presets for standard pages:

| Preset Identifier | Target Route | Description |
| --- | --- | --- |
| `LinkPresets.Home` | `/` | Blog homepage |
| `LinkPresets.Archive` | `/archive/` | Chronological archive |
| `LinkPresets.Friends` | `/friends/` | Friend links page |
| `LinkPresets.Moments` | `/moments/` | Microblogging / status stream |
| `LinkPresets.Anime` | `/anime/` | Bangumi / anime watchlist |
| `LinkPresets.About` | `/about/` | About page |

## Navigation Structure (links)

```ts title="src/config/navbarConfig.ts"
export const navbarConfig = withUserConfig("navbar", {
  links: [
    LinkPresets.Home,
    LinkPresets.Archive,
    {
      name: "Pages",
      icon: "material-symbols:widgets-outline",
      children: [
        LinkPresets.Friends,
        LinkPresets.Moments,
        LinkPresets.Anime,
        LinkPresets.About,
      ],
    },
  ],
})
```

## Custom Links

You can insert custom external or internal navigation items:

```ts
{
  name: "Documentation",
  url: "https://docs.example.com/",
  icon: "material-symbols:menu-book-outline",
  external: true,
}
```

## Content Repo Overlay (Dual-Repo Mode)

In dual-repo setups, create `config/navbar.yaml` in the content repo:

```yaml title="config/navbar.yaml"
links:
  - Home
  - Archive
  - name: Docs
    url: https://docs.example.com/
```

## Practical Examples

**Compact Navigation**

```ts title="src/config/navbarConfig.ts"
export const navbarConfig = withUserConfig("navbar", {
  links: [
    LinkPresets.Home,
    LinkPresets.Archive,
    LinkPresets.About,
  ],
})
```

## FAQ

::: collapse
- Dropdown menu does not open

  Verify that the `children` array contains valid navigation items or LinkPresets.

- External link icon doesn't show

  Add `external: true` to indicate external navigation targets.

- Preset text does not change with language

  Preset names are automatically translated via i18n dictionary files in `src/i18n/`.
:::
