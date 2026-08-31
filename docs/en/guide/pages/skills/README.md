---
title: Skills
createTime: 2026/09/01 00:26:00
permalink: /en/guide/pages/skills/
---

The skills page (`/skills/`) presents your tech stack and proficiency levels. Behavior is controlled by `skillsConfig.ts`; entries live in `src/data/skills.ts`.

## Behavior Config

```ts title="src/config/skillsConfig.ts"
export const skillsConfig = withUserConfig("skills", {
  enable: true,        // master switch: false hides nav, /skills/ returns 404
  categories: [        // filter list; array order = chips order on the page
    { key: "frontend", label: "Frontend", icon: "material-symbols:web-rounded" },
    { key: "backend", label: "Backend", icon: "material-symbols:dns-rounded" },
    { key: "tooling", label: "Tooling", icon: "material-symbols:construction-rounded" },
  ],
  // disabledNames: [], // optional: disabled skill names
})
```

| Field | Description |
| --- | --- |
| `enable` | Page master switch |
| `categories` | Filter list; entries reference keys via `category` |
| `disabledNames` | Disable an entry by skill name (note: unlike other pages which match by key/ID, this matches by name) |

## Data Fields

```ts title="src/data/skills.ts"
export const skillsData: SkillItem[] = [
  {
    name: "TypeScript",                    // skill name (unique; disable matches on it)
    description: "Typed application code…", // one-line description
    icon: "simple-icons:typescript",        // iconify icon
    category: "frontend",                   // category, references a config key
    level: "expert",                        // proficiency level
  },
]
```

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Skill name, must be unique (`disabledNames` matches on it) |
| `description` | No | One-line description |
| `icon` | No | iconify icon (`simple-icons:*` covers most languages/brands) |
| `category` | Yes | References a config category key |
| `level` | Yes | Proficiency level |

## Proficiency Levels

`level` describes your mastery; common values:

| level | Meaning |
| --- | --- |
| `expert` | Expert—primary technology |
| `advanced` | Advanced—smooth daily development |
| `intermediate` | Intermediate—handles common tasks |
| `beginner` | Beginner—learning |

The page visualizes levels accordingly; pick from the four tiers above and stay consistent site-wide.

## Practical Examples

**Adding a skill**

```ts title="src/data/skills.ts"
{
  name: "Rust",
  description: "Systems programming and high-performance tooling.",
  icon: "simple-icons:rust",
  category: "backend",
  level: "intermediate",
}
```

**Hiding a skill**

```ts title="src/config/skillsConfig.ts"
disabledNames: ["PHP"],
```

::: warning Name-Based Matching
The skills page disables by `disabledNames` (by name), unlike the projects page's `disabledKeys` (by key)—the name must exactly match the entry's `name` (case-sensitive).
:::

**Adding a Design category**

```ts title="src/config/skillsConfig.ts"
categories: [
  { key: "frontend", label: "Frontend", icon: "material-symbols:web-rounded" },
  { key: "backend", label: "Backend", icon: "material-symbols:dns-rounded" },
  { key: "design", label: "Design", icon: "material-symbols:brush-rounded" },
]
```

## FAQ

::: collapse
- A skill doesn't show
  Check three layers: page `enable` → does `category` reference an existing key in `categories` → is the `name` hit by `disabledNames`.

- What about duplicate skill names
  `disabledNames` matching by name affects all same-named entries. Keep names unique; if you must distinguish them, add a suffix (like `Node.js (Backend)`).

- Where to find icons
  Language/framework icons live in the `simple-icons:*` set (already installed); see [icones.js.org](https://icones.js.org/) for the full list.
:::
