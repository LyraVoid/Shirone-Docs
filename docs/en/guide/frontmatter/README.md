---
title: Frontmatter
createTime: 2026/08/31 23:10:00
permalink: /en/guide/frontmatter/
---

Every post is a Markdown (or MDX) file under `src/content/posts/`. The YAML frontmatter block at the top defines post-level metadata. This document is a complete reference for all supported fields. For post creation workflows and directory conventions, see [Writing Posts](/en/guide/writing-post/).

## What Is Frontmatter

Frontmatter is a YAML-formatted configuration block enclosed by triple-dash `---` dividers at the very top of a Markdown file. Article content begins immediately following the second `---`:

```yaml title="src/content/posts/my-first-post.md"
---
title: My First Post
published: 2026-08-26
description: A short summary displayed in post lists and metadata cards.
image: ./cover.webp
tags: [Astro, Notes]
category: Writing
draft: false
---

Content begins here.
```

## Field Reference

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `string` | Yes | Post title displayed in listings and header |
| `published` | `date` | Yes | Publication date used for chronological sorting and display |
| `publishedAt` | `datetime` | No | Precise publication timestamp for same-day ordering, timezone conversion, and permalink tokens |
| `description` | `string` | No | Summary shown on post cards and in SEO metadata |
| `image` | `string` | No | Cover image: relative path (`./cover.webp`), `public` path (`/img/x.webp`), or remote URL |
| `tags` | `array` | No | Tags powering the tag archive and tag cloud widget |
| `category` | `string` | No | Category powering the category archive and sidebar |
| `draft` | `boolean` | No | `true` marks as draft (hidden in production builds) |
| `updated` | `date` | No | Last updated date, triggers the "Last updated" banner |
| `pinned` | `boolean` | No | `true` pins the post to the top of listings |
| `lang` | `string` | No | Declares post language code (e.g. `en`, `zh_CN`) |
| `comment` | `boolean` | No | Disable comments for this single post |
| `encrypted` | `boolean` | No | Flag indicating encrypted status |
| `password` | `string` | No | Encryption password (implicitly enables encryption) |
| `passwordHint` | `string` | No | Hint text displayed beneath the password input |
| `hideHomeContent` | `boolean` | No | Conceals summary and word count on homepage, archive, and RSS |

## Field Groups

### Core Metadata

`title` and `published` are the only required fields: the title appears on cards and headers, while the publish date controls chronological ordering. When `description` is omitted, the post card automatically extracts the initial content sentences as a summary.

### Content Relations

`image`, `tags`, and `category` shape post navigation and visual presentation:

- Cover images render on post cards; missing images fallback to clean typography
- A post may have multiple tags but only one category; both are automatically aggregated across the site

### Lifecycle & State

| Field | Behavior |
| --- | --- |
| `draft: true` | Draft state: excluded from production builds, visible in dev mode |
| `pinned: true` | Pinned: displayed at the top of the post archive |
| `updated` | Displays "Last updated at" banner on the article page |
| `lang` | Explicitly specifies post language |
| `comment: false` | Disables comment box for this specific post |

### Client-Side Encryption Fields

`encrypted`, `password`, `passwordHint`, and `hideHomeContent` configure the zero-knowledge encryption pipeline. Setting `password` implicitly activates encryption.

## Image Path Rules

`image` and body images support three formats:

| Format | Example | Behavior |
| --- | --- | --- |
| Relative path | `./cover.webp` | Resolved relative to the post file with build optimization (recommended) |
| Absolute path | `/images/x.webp` | Resolved relative to `public/`, served as-is |
| Remote URL | `https://cdn.example.com/x.webp` | Loaded directly from external CDN |

## Time and Timezone

`published`, `publishedAt`, and `updated` are formatted according to `siteConfig.timeZone` (see [Site Configuration](/en/guide/layout/site-config/)).

### Plain Dates vs. Precise Timestamps

- **Date-Only Posts**: For most posts, specifying a plain date (`published: 2026-08-26`) is sufficient. When `published` is a date-only value at UTC `00:00:00`, Shirone treats it as a ==plain date==, avoiding unintended day shifts from timezone conversion.
- **Precise Timing**: When hour and minute precision is required, supply a full ISO timestamp (`published: 2026-08-26T14:30:00+08:00`) or declare `publishedAt`.

> [!TIP] Ordering Multiple Posts on the Same Day
> Post archives sort posts in reverse chronological order. When multiple posts share the same plain date `YYYY-MM-DD`, ties are broken by post ID.
>
> To explicitly control the display order of posts published on the same day:
> 1. Specify a full timestamp directly in `published`: `published: 2026-08-26T15:30:00+08:00`
> 2. Or pair `published: 2026-08-26` with `publishedAt: 2026-08-26T15:30:00+08:00`

## YAML Syntax Notes

- Colons must be followed by a space: `title: Correct` (`title:Wrong` will be treated as invalid)
- Wrap strings with special characters in quotes: `password: "my-secret"`
- Both array formats are equivalent: `tags: [A, B]` or line-by-line `- A` / `- B`
- Field names are case-sensitive: `Title` is not recognized as `title`

## FAQ

::: collapse
- What happens if frontmatter syntax is wrong

  YAML syntax errors fail the build immediately with exact file and line locations. Unknown field names are safely ignored. Run `npx astro check` to validate changes.

- Can I define custom frontmatter fields

  Unrecognized fields are ignored by default. If you need custom data in build scripts, store it in content bodies or dedicated data files.

- Relationship between description and opening paragraph

  `description` is explicitly prioritized for list cards, SEO meta tags, and RSS feeds. When omitted, the build falls back to extracting the opening paragraph.

- How to control the order of multiple posts published on the same day

  Post lists sort in reverse chronological order. If multiple posts use the same date (such as `2026-08-26`), the system sorts ties by post ID. To precisely determine the order, assign a later timestamp with hours and minutes (via the `published` timestamp or `publishedAt` field) to the post you want to appear first.
:::
