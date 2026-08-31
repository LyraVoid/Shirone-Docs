---
title: Projects
createTime: 2026/09/01 00:25:00
permalink: /en/guide/pages/projects/
---

The projects page (`/projects/`) showcases your open-source work and portfolio. Behavior is controlled by `projectsConfig.ts`; entries live in `src/data/projects.ts`.

## Behavior Config

```ts title="src/config/projectsConfig.ts"
export const projectsConfig = withUserConfig("projects", {
  enable: true,        // master switch: false hides nav, /projects/ returns 404
  categories: [        // filter list; array order = chips order on the page
    { key: "theme", label: "Theme", icon: "material-symbols:palette-outline-rounded" },
    { key: "android", label: "Android", icon: "material-symbols:android-rounded" },
  ],
  // disabledKeys: [], // optional: disabled project keys
})
```

| Field | Description |
| --- | --- |
| `enable` | Page master switch |
| `categories` | Filter list; entries reference these `key`s via their `category` field |
| `disabledKeys` | Disable a single entry by project `key` (not rendered, data retained) |

## Data Fields

```ts title="src/data/projects.ts"
export const projectsData: ProjectItem[] = [
  {
    key: "shirone",                    // unique id (disable list matches on it)
    title: "Shirone",                  // project name
    summary: "An Astro blog theme…",   // one-line summary
    category: "theme",                 // category, references a config key
    phase: "building",                 // "building" | "shipped"
    technologies: ["Astro", "Svelte"], // tech stack tags
    icon: "material-symbols:…",        // iconify icon
    cover: "/assets/projects/shirone.webp",  // cover (optional)
    coverAlt: "Cover alt text",        // accessible description (optional)
    featured: true,                    // featured display
    repository: "https://github.com/…", // repo link (optional)
    year: "2026",                      // year (optional)
  },
]
```

| Field | Required | Description |
| --- | --- | --- |
| `key` | Yes | Unique identifier; `disabledKeys` matches on it |
| `title` / `summary` | Yes | Name and summary |
| `category` | Yes | References a config category key |
| `phase` | Yes | `"building"` or `"shipped"` |
| `technologies` | No | Tech stack tag list |
| `icon` / `cover` / `coverAlt` | No | Icon, cover image, cover alt text |
| `featured` | No | `true` for featured display |
| `repository` / `year` | No | Repo link, year |

## Practical Examples

**Adding a project**

```ts title="src/data/projects.ts"
{
  key: "my-tool",
  title: "MyTool",
  summary: "A CLI tool that boosts development efficiency.",
  category: "theme",           // must be an existing key in categories
  phase: "building",
  technologies: ["Node.js", "TypeScript"],
  icon: "simple-icons:nodedotjs",
  repository: "https://github.com/you/my-tool",
}
```

**Hiding a project while keeping its data**

```ts title="src/config/projectsConfig.ts"
disabledKeys: ["folkpatch"],
```

**Adding a category**

```ts title="src/config/projectsConfig.ts"
categories: [
  { key: "theme", label: "Theme", icon: "material-symbols:palette-outline-rounded" },
  { key: "android", label: "Android", icon: "material-symbols:android-rounded" },
  { key: "tooling", label: "Tooling", icon: "material-symbols:construction-rounded" },
]
```

## FAQ

::: collapse
- A new project doesn't show

  Check three layers: page `enable` → does `category` reference an existing key in `categories` → is the `key` hit by `disabledKeys`.

- Where do cover images go

  `cover` supports absolute paths relative to `public` (`/assets/projects/xxx.webp`) and similar forms; path rules match post images (see [Image Gallery & File Organization](/en/guide/writing/gallery/)).

- What values does phase take

  `"building"` and `"shipped"`, styled differently on the page.
:::
