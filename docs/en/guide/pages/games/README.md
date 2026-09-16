---
title: Games
createTime: 2026/09/16 12:00:00
permalink: /en/guide/pages/games/
---

The games page (`/games/`) presents your games list—landscape covers, ratings, playtime, and short reviews. Behavior is controlled by `gamesConfig.ts`; entries live in `src/data/games.ts`.

## Behavior Config

```ts title="src/config/gamesConfig.ts"
export const gamesConfig: GamesConfig = withUserConfig("games", {
  enable: true,        // master switch: false hides nav, /games/ returns 404
  categories: [        // game categories; array order = chips order on the page
    {
      key: "open-world",
      label: "Open World",
      icon: "material-symbols:explore-outline-rounded",
      description: "Open-world adventures",
    },
    // …Sandbox / RPG / Action / Casual
  ],
  // disabledIds: [], // optional: disabled game IDs
})
```

| Field | Description |
| --- | --- |
| `enable` | Master switch for the page |
| `categories` | Category list (`key` / `label` / `icon` / `description`); categories without entries auto-hide |
| `disabledIds` | Disable individual games by `id` (`disabledKeys` alias supported) |

The page ships real-time search (name, developer, platform, year, description, and tags) plus category filtering; filter state syncs to the URL (`?category=` / `?q=`) and survives reloads and sharing.

## Data Fields

```ts title="src/data/games.ts"
export const gamesData: GameItem[] = [
  {
    id: "minecraft",                // unique ID (matched by disabledIds)
    name: "Minecraft",              // game title
    developer: "Mojang Studios",    // developer / studio
    category: "sandbox",            // references a category key from config
    status: "playing",              // play status
    cover: "assets/games/minecraft-hero.jpg", // landscape cover (optional)
    icon: "material-symbols:widgets-rounded", // icon when no cover is set
    rating: 5,                      // rating (0-5, 0.5 steps)
    hours: 420,                     // playtime in hours
    platform: "PC",                 // platform
    year: "2011",                   // release year
    tags: ["Sandbox", "Survival"],  // genre chips on the card
    description: "A blocky sandbox…", // short review
    link: "https://www.minecraft.net/", // store / official page
    featured: true,                 // Featured badge
  },
]
```

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | Unique ID, matched by `disabledIds` |
| `name` / `developer` | Yes | Game title and developer |
| `category` | Yes | References a config category key |
| `status` | Yes | `playing` / `completed` / `backlog` / `wishlist`, rendered as a status pill |
| `description` | Yes | Short review |
| `cover` | No | Landscape cover (16:9 or wider recommended). Accepts a `src/assets` relative path (build-time image pipeline), an absolute `/public` path, or a remote URL; falls back to an icon tile when omitted |
| `icon` | No | Iconify icon for cover-less cards |
| `rating` / `hours` | No | Rating (0-5, 0.5 steps) and playtime in hours |
| `platform` / `year` | No | Platform and release year |
| `tags` | No | Genre chips |
| `link` / `featured` | No | Store link and Featured badge |

Unlike other showcase pages, game covers are **landscape** (capsule art) and the card leads with the wide banner, so the media field is `cover` rather than a square image.

## Practical Examples

**Add a game**

```ts title="src/data/games.ts"
{
  id: "tears-of-the-kingdom",
  name: "The Legend of Zelda: Tears of the Kingdom",
  developer: "Nintendo",
  category: "open-world",
  status: "completed",
  rating: 5,
  hours: 180,
  platform: "Switch",
  year: "2023",
  tags: ["Open World", "Adventure"],
  description: "The pinnacle of creative sandbox traversal.",
  link: "https://www.zelda.com/tears-of-the-kingdom/",
}
```

**Shelve a game but keep the data**

```ts title="src/config/gamesConfig.ts"
disabledIds: ["minecraft"],
```

**Add a Simulation category**

```ts title="src/config/gamesConfig.ts"
categories: [
  // …existing categories,
  {
    key: "simulation",
    label: "Simulation",
    icon: "material-symbols:factory-outline-rounded",
    description: "Builders, tycoons & management sims",
  },
]
```

## FAQ

::: collapse
- A game does not show up

  Three-layer check: page `enable` → does `category` reference an existing `categories` key → is `id` hit by `disabledIds`. A category whose entries are all hidden removes its chip automatically.

- Which cover formats are accepted

  Three forms: a `src/assets` relative path (processed by the build-time image pipeline, recommended), an absolute `/public` path (served as-is), or a remote URL. Landscape art (16:9 or wider) looks best; without `cover` the card falls back to an `icon` tile.

- Which status values exist

  `playing`, `completed`, `backlog`, and `wishlist`. Status pills use M3 tonal pairs so contrast stays accessible.
:::
