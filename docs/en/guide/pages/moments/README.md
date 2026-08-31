---
title: Moments
createTime: 2026/09/01 00:31:00
permalink: /en/guide/pages/moments/
---

Moments (`/moments/`) are a lighter dynamic feed than posts—stray thoughts, screenshot shares, ongoing little experiments. Each moment is a Markdown file whose frontmatter supports an **image layout array** plus mood and location metadata.

## Content Location

```file-tree title="Moments Content Directory"
src/content/moments/
├── 2026-08-15-welcome.md
├── 2026-08-12-riverside.md
└── 2026-08-08-late-night-coding.md
```

## Frontmatter Field Reference

```markdown title="src/content/moments/2026-08-12-riverside.md"
---
published: 2026-08-12T18:30:00+08:00   # publish time (with timezone), required
mood: material-symbols:sentiment-excited-outline-rounded  # mood icon
tags:                                   # tags for filtering
  - wallpaper
  - daily
images:                                 # image layout array
  - src: /images/moments/girls-trio/girl-1.webp
    alt: Lovely girl wallpaper one
  - src: /images/moments/girls-trio/girl-2.webp
    alt: Lovely girl wallpaper two
---

Body: one or two sentences is enough.
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `published` | `datetime` | Yes | Publish time (with timezone), determines feed ordering |
| `pinned` | `boolean` | No | `true` pins the moment (multiple pins sort by time descending) |
| `mood` | `string` | No | Mood icon, iconify code |
| `tags` | `array` | No | Tags for feed filtering |
| `location` | `string` | No | Location text (e.g. "At my desk") |
| `images` | `array` | No | **Image layout array**—see below |

## Image Layout (images)

A Moments-exclusive capability: declare an `images` array in the frontmatter, each item with `src` and `alt`, and they render as a tidy image grid/film-strip automatically.

### Basic Usage

```yaml
images:
  - src: /images/moments/trio/girl-1.webp
    alt: First wallpaper
  - src: /images/moments/trio/girl-2.webp
    alt: Second wallpaper
  - src: /images/moments/trio/girl-3.webp
    alt: Third wallpaper
```

- Array order is the display order
- `src` accepts `public` absolute paths (`/images/…`) or remote URLs
- `alt` is the accessible description—worth filling in
- Multiple images lay out automatically; no grid markup needed—tidier than pasting images in the body

### Count and Layout Effects

Two typical patterns from the built-in samples:

| Scenario | Count | Effect |
| --- | --- | --- |
| Wallpaper trio | 3 | A neat horizontal grid (`2026-08-12-riverside.md`) |
| Film-strip multi-image | 7 | A multi-row image flow (`2026-08-03-film-roll.md`) |

For one or two images, inline body images feel lighter; from three up, use the `images` array—clearly better-looking.

### Where to Put Images

Keep them grouped under `public/images/moments/<topic>/`, matching the moment's `date-topic` naming for easy management.

## Writing the Body

Moment bodies support full Markdown, but keep them light:

- A sentence or two of musing
- A quote, a link
- Captions to pair with the `images` array

```markdown
---
published: 2026-08-12T18:30:00+08:00
mood: material-symbols:sentiment-excited-outline-rounded
tags: [wallpaper, daily]
images:
  - src: /images/moments/trio/girl-1.webp
    alt: Wallpaper one
---

Three new wallpapers—my desktop got brighter, and so did my mood for coding.
```

## Moments vs. Posts vs. Timeline

| Dimension | Moments | Posts | Timeline |
| --- | --- | --- | --- |
| Weight | Lightest | Heaviest | Medium |
| Structure | Fragmented feed + image flow | Full-length articles | Node-based milestones |
| Filtering | mood + tags | categories + tags | categories |

## FAQ

::: collapse
- A moment doesn't show

  Check that `published` is a valid full timestamp (with timezone offset) and that the file is under `src/content/moments/`.

- images don't show

  A `src` starting with `/` is relative to the `public` directory—confirm the image exists under `public/images/moments/…`; remote URLs need `https://`.

- The mood icon renders as a square

  The icon set isn't installed. Confirm the set at [icones.js.org](https://icones.js.org/), install `@iconify-json/<set>`, and rebuild.

- Can I post a text-only moment

  Yes—`images` is optional; omit it for a plain-text post.
:::
