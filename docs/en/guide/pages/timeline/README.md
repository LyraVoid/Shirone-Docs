---
title: Timeline
createTime: 2026/09/01 00:28:00
permalink: /en/guide/pages/timeline/
---

The timeline page (`/timeline/`) presents your milestones and experiences as a node stream. Behavior is controlled by `timelineConfig.ts`; entries live in `src/data/timeline.ts`. It is the only showcase page with an **ordering config**.

## Behavior Config

```ts title="src/config/timelineConfig.ts"
export const timelineConfig = withUserConfig("timeline", {
  enable: true,        // master switch: false hides nav, /timeline/ returns 404
  categories: [        // filter list; array order = chips order on the page
    { key: "milestone", label: "Milestones", icon: "material-symbols:flag-rounded" },
    { key: "project", label: "Projects", icon: "material-symbols:code-rounded" },
    { key: "career", label: "Career", icon: "material-symbols:work-rounded" },
    { key: "education", label: "Education", icon: "material-symbols:school-rounded" },
    { key: "life", label: "Life", icon: "material-symbols:favorite-rounded" },
  ],
  order: "desc",       // "desc" newest first (default) | "asc" oldest first
  // disabledTitles: [], // optional: disabled event titles
})
```

| Field | Description |
| --- | --- |
| `enable` | Page master switch |
| `categories` | Filter list; five defaults (Milestones/Projects/Career/Education/Life) |
| `order` | **Unique to this page**: `"desc"` newest first (default) / `"asc"` oldest first |
| `disabledTitles` | Disable an entry by event title |

## Data Fields

```ts title="src/data/timeline.ts"
export const timelineData: TimelineItem[] = [
  {
    title: "Shirone Theme Major Upgrade",   // event title (disable matches on it)
    date: "2026.08",                        // time text (free-form, e.g. a range)
    category: "milestone",                  // category, references a config key
    subtitle: "Open Source Project",        // subtitle (optional)
    location: "Tokyo, Japan",               // location (optional)
    description: "Refactored the theme…",   // description
    highlights: [                           // bullet list (optional)
      "Implemented dynamic HCT palette",
      "Added multi-page capabilities",
    ],
    tags: ["Astro", "Svelte 5"],            // tech tags (optional)
    links: [                                // related links (optional)
      { label: "GitHub", url: "https://github.com/…", icon: "fa6-brands:github" },
    ],
    icon: "material-symbols:rocket-launch-rounded",  // node icon
    featured: true,                         // featured
  },
]
```

| Field | Required | Description |
| --- | --- | --- |
| `title` | Yes | Event title; `disabledTitles` matches on it |
| `date` | Yes | Time text, free-form (ranges and single points both work) |
| `category` | Yes | References a config category key |
| `subtitle` / `location` | No | Subtitle, location |
| `description` | No | Description |
| `highlights` | No | Bullet list (array) |
| `tags` / `links` / `icon` / `featured` | No | Tags, related links, node icon, featured |

## Ordering Direction

The timeline is the only showcase page with an `order` field:

```ts
order: "desc",  // default: newest first—good for "what I've been up to"
order: "asc",   // oldest first—good for "from the beginning" growth stories
```

::: tip date Is Free Text
`date` doesn't need a machine-parseable format—`"2025.03 – Present"` or `"Summer 2024"` are all valid and displayed as written. Just keep the style consistent site-wide.
:::

## Practical Examples

**Adding an experience**

```ts title="src/data/timeline.ts"
{
  title: "Independent Developer",
  date: "2026.01 – Present",
  category: "career",
  subtitle: "Freelance",
  description: "Went full-time indie, maintaining open-source projects and taking contracts.",
  highlights: [
    "Shipped two small tools",
    "Built a steady subscription income",
  ],
  tags: ["Indie", "Product"],
  icon: "material-symbols:rocket-launch-rounded",
}
```

**A growth-story timeline (oldest first)**

```ts title="src/config/timelineConfig.ts"
order: "asc",
```

**Hiding an experience**

```ts title="src/config/timelineConfig.ts"
disabledTitles: ["An experience I don't show"],
```

## FAQ

::: collapse
- An event doesn't show

  Check three layers: page `enable` → does `category` reference an existing key in `categories` → is the `title` hit by `disabledTitles`.

- The order is wrong

  Verify the `order` value; events in the same period render in data array order—reorder the array for fine-tuning.

- A link's icon doesn't show

  `icon` is an iconify code; brand icons use `fa6-brands:*` (already installed), other sets need installation first.
:::
