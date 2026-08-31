---
title: Navigation Bar
createTime: 2026/08/31 22:33:00
permalink: /en/guide/layout/navbar/
---

The navigation bar is configured centrally in `navBarConfig.ts`, driving both the desktop header dropdown menus and the mobile navigation drawer.

## Presets Table (LinkPresets)

Shirone includes 15 built-in presets:

| Preset | URL | Description |
| --- | --- | --- |
| `Home` | `/` | Home |
| `Archive` | `/archive/` | Archives |
| `Friends` | `/friends/` | Friend Links |
| `Moments` | `/moments/` | Moments |
| `Anime` | `/anime/` | Anime Watchlist |
| `Compass` | `/compass/` | Compass / Discovery |
| `Skills` | `/skills/` | Skills Radar |
| `Projects` | `/projects/` | Project Showcase |
| `Devices` | `/devices/` | Hardware Devices |
| `Timeline` | `/timeline/` | Growth Timeline |
| `Albums` | `/albums/` | Photo Albums |
| `Categories` | `/categories/` | Post Categories |
| `Tags` | `/tags/` | Post Tags |
| `About` | `/about/` | About Me |
| `GitHub` | External | Theme Repository |

Each preset contains localized labels and Material Symbols icons.

## Navigation Structure (links)

```ts title="src/config/navBarConfig.ts"
const defaultNavBarConfig: NavBarConfig = {
  links: [
    LinkPresets.Home,
    LinkPresets.Archive,
    LinkPresets.Friends,
    LinkPresets.Moments,
    LinkPresets.Anime,
    LinkPresets.Compass,
    LinkPresets.Albums,
    {
      name: i18n(I18nKey.more),
      icon: "material-symbols:apps-rounded",
      children: [
        ...(timelineConfig.enable ? [LinkPresets.Timeline] : []),
        ...(projectsConfig.enable ? [LinkPresets.Projects] : []),
        ...(devicesConfig.enable ? [LinkPresets.Devices] : []),
        ...(skillsConfig.enable ? [LinkPresets.Skills] : []),
        LinkPresets.About,
        LinkPresets.GitHub,
      ],
    },
  ],
}
```

- **Order**: Items render in the order specified in the `links` array.
- **Dropdowns**: Items containing `children` become dropdown menus on desktop and sub-lists in the mobile drawer.
- **Conditional Visibility**: Links inside the `more` dropdown check `enable` flags from their respective config domains.

## Custom Links

```ts title="src/config/navBarConfig.ts"
links: [
  LinkPresets.Home,
  LinkPresets.Archive,
  {
    name: "Custom Site",
    url: "https://example.com",
    icon: "fa6-brands:github",  // Any Iconify icon name
    external: true,             // Opens in new tab
  },
]
```

## Content Repo Overlay (Dual-Repo Mode)

In dual-repository setups, configure `config/nav-bar.yaml` in your content repository:

```yaml title="config/nav-bar.yaml"
links:
  - preset: Home
  - preset: Archive
  - name: "$t:friends"        # Prefix with $t: to reference i18n keys
    url: /friends/
  - name: Collections
    children:
      - preset: Anime
      - preset: Albums
      - name: "$t:about"
        preset: About
```
