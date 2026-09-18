---
title: Series Page
createTime: 2026/09/18 12:00:00
permalink: /en/guide/pages/series/
---

The Series showcase (`/series/`) organizes multi-part technical articles, tutorials, or themed essays into structured serial collections—such as "Frontend from Scratch", "Travel Notes", or "Game Playthrough Guides". <Badge text="Serial Collections" type="tip" />

When reading multi-part posts, visitors often find it hard to navigate between chapters. With the Series feature enabled:
- Each post automatically features a **series navigation card** indicating the current part and letting readers jump to the previous or next article in one click;
- The site provides a dedicated **Series Overview page** (`/series/`) and **Series Detail page** (`/series/<slug>/`) to browse all chapters in order;
- The sidebar can host a **Series list widget** displaying your most recently updated collections.

---

## Directory Structure

Series files and blog posts live alongside each other in the content area with a clean, intuitive layout:

```file-tree title="Series and Posts Directory Structure"
content/ (or src/content/ in single repo)
├── series/                  # Series definition files
│   ├── docker-guide.md      # Series 1 (filename is the series slug)
│   └── travel-japan.md      # Series 2
└── posts/                   # Standard blog posts
    ├── docker-01.md         # Post 1: linked to docker-guide
    ├── docker-02.md         # Post 2: linked to docker-guide
    └── regular-post.md      # Regular post: omits the series field
```

---

## Two Steps to Create Your First Series

Grouping articles into a series takes just two easy steps:

:::: steps
1. **Create a Series Overview File**

   Create a new `.md` file under `content/series/` (or `src/content/series/`). The filename becomes the series slug (e.g. `docker-guide.md`):

   ::: tabs
   @tab Ongoing (Recommended)
   ```markdown title="src/content/series/docker-guide.md"
   ---
   title: Docker from Zero to Production
   status: ongoing
   defaultCategory: DevOps
   ---

   Write an introductory note or syllabus here (standard Markdown is supported).
   This note appears at the top of the series detail page to explain the collection background.
   ```

   @tab Completed
   ```markdown title="src/content/series/travel-japan.md"
   ---
   title: Autumn in Kansai
   status: completed
   defaultCategory: Travel
   ---

   A one-week autumn trip across Osaka, Kyoto, and Nara.
   All chapters in this series have been published.
   ```
   :::

   #### Series Parameters

   | Field | Required | Default | Description |
   | --- | --- | --- | --- |
   | `title` | **Yes** | None | Full display name of the series |
   | `status` | No | `ongoing` | Status badge: `ongoing` or `completed` |
   | `defaultCategory` | No | Empty | Fallback category applied when an article in the series omits its own `category` |

   > [!TIP] Introductory Body is Optional
   > If you simply want to group articles without writing a custom preface, leaving the body empty works fine.

2. **Link Articles to the Series**

   Open the articles you wish to include (under `content/posts/`), and add `series` and `seriesOrder` to the frontmatter:

   ```yaml title="src/content/posts/docker-01.md"
   ---
   title: "Docker Fundamentals"
   published: 2026-08-27
   category: "DevOps"

   # Matches the filename from Step 1 (without the .md suffix)
   series: "docker-guide"

   # The sequential part number in this series (integer starting from 1)
   seriesOrder: 1
   ---

   Article content starts here...
   ```

   Save the file and you are all set! The system handles all linking and navigation automatically.

   - **`series`**: The filename of the series entity. Assigns the post to that collection;
   - **`seriesOrder`**: Controls reading order within the series (e.g. Part 1, Part 2). If omitted, posts sort by publish date in chronological order.
::::

---

## Reader Experience

Once configured, readers enjoy three complementary discovery surfaces:

:::: card-grid cols="3"
::: card title="1. In-Post Series Navigation" icon="ri:compass-3-line"
A dedicated series section appears at the bottom (or top) of each post, showing the series title, status pill (Ongoing / Completed), current progress (e.g. "Part 2 of 5"), and direct links to previous/next chapters.
:::

::: card title="2. Site-Wide Overview (/series/)" icon="ri:layout-grid-line"
Spacious overview cards present all collections on your site, complete with descriptions, post counts, and latest update timestamps.
:::

::: card title="3. Collection Detail (/series/[slug]/)" icon="ri:list-check-2"
Highlights the series preface banner and cleanly lists every chapter in sequential order for linear reading.
:::
::::

---

## Settings & Customization

To customize titles, descriptions, or the in-post card position:

::: tabs
@tab Dual-Repo Mode (Recommended)
```yaml title="config/series.yaml"
# Master toggle: when false, /series/ returns 404, and nav/sidebar links are hidden
enable: true

# Title for the series index page (defaults to translated "Series")
title: "$t:series"

# SEO meta description; leave empty to auto-generate "X series · Y posts"
description: ""

# Where the series navigation card renders inside posts:
# - "top": below title metadata
# - "bottom": after main content, before related reading (default)
cardPosition: "bottom"
```

@tab Single-Repo Mode
```ts title="src/config/seriesConfig.ts"
export const seriesConfig: SeriesConfig = withUserConfig("series", {
  enable: true,           // Master switch
  title: "$t:series",     // Index page title
  description: "",        // SEO description
  cardPosition: "bottom", // In-post card placement
})
```
:::

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | Feature switch. When `false`, series pages return 404 and zero runtime markup is injected |
| `title` | `string` | `"$t:series"` | Series index page title. Accepts `$t:` i18n keys or literal strings like `"My Specials"` |
| `description` | `string` | `""` | SEO description. When empty, automatically summarizes total series and post counts |
| `cardPosition` | `"top"` / `"bottom"` | `"bottom"` | Position of the in-post series block: `"top"` below metadata; `"bottom"` after post content |

---

## Navigation and Sidebar Integration

### Top Navigation Bar
The theme provides a built-in `Series` preset:

::: tabs
@tab Dual-Repo Mode (config/nav-bar.yaml)
```yaml title="config/nav-bar.yaml"
links:
  - Home
  - Archive
  - Series      # Links directly to /series/
  - About
```

@tab Single-Repo Mode (src/config/navBarConfig.ts)
```ts title="src/config/navBarConfig.ts"
links: [
  LinkPresets.Home,
  LinkPresets.Archive,
  LinkPresets.Series,
  LinkPresets.About,
]
```
:::

### Sidebar Widget
The theme includes a `series` widget that lists your most recently updated series:

```ts title="src/config/sidebarConfig.ts"
{
  type: "series",
  enable: true,
  slot: "sticky",       // Sticky positioning during page scroll
  collapseAfter: 5,     // Folds after 5 items and adds a "View All" button
}
```

---

## FAQ

::: collapse
- A post specifies series, but no series card appears?

  Check the following three common causes:
  1. **Filename check**: Verify that the matching `.md` file exists under `src/content/series/` (or `content/series/`), with the exact same spelling as `series` (case-sensitive);
  2. **Switch check**: Ensure `enable: true` in `seriesConfig.ts` or `config/series.yaml`;
  3. **Draft check**: Ensure the article is not marked as a draft (`draft: false`). Series blocks only render when there is at least one published post.

- What happens if an article's category conflicts with the series defaultCategory?

  **The article's own `category` always takes precedence**. The series `defaultCategory` is only used as a fallback when an article does not define any category.

- Can series filenames contain special characters?

  For clean and dependable URLs across all browsers and devices, **use lowercase letters, numbers, and hyphens** (e.g. `docker-guide`, `japan-travel`), avoiding spaces or symbols.
:::
