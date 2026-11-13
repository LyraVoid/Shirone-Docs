---
title: Moments
createTime: 2026/09/01 00:31:00
permalink: /en/guide/pages/moments/
---

Moments (`/moments/`) are a lighter dynamic feed than posts—stray thoughts, screenshot shares, ongoing little experiments. Each moment is a Markdown file whose frontmatter supports an **image layout array**, mood and location metadata, and can be password-protected like a post.

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
| `encrypted` | `boolean` | No | Set to `true` to flag encryption; without a password the build fails |
| `password` | `string` / `number` | No | Any non-empty value turns encryption on; you don't need `encrypted` too |
| `passwordHint` | `string` | No | Hint shown under the password box |

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

## Encrypted Moments

Moments can be password-protected just like posts: put a non-empty `password` in the frontmatter and you're done. `encrypted: true` only spells it out.

```markdown title="src/content/moments/2026-09-02-private-note.md"
---
published: 2026-09-02T21:00:00+08:00
encrypted: true
password: "your-super-secret-password"
passwordHint: "My favourite anime"
tags: [diary]
---

This moment only appears after unlocking.
```

The body is encrypted at build time, so the page source only holds ciphertext. Publish time, pinned state, password hint and the public `filterTags` stay visible.

:::: warning What gets encrypted
- The body, location, mood, display tags and image list are all encrypted.
- Tags stay public as `filterTags`, so the filter bar still lists them.
- Image files themselves still sit under `public/` and anyone with the URL can open them—don't use an encrypted moment for sensitive images.
::::

Unlocking restores the normal moment card in place. Unlike posts and albums, moments **don't remember the unlock**: refresh or come back later and you'll be asked again. Locked moments stay out of site search, but tag filtering still works.

If you set `encrypted: true` and forget the password, the build stops with `Encrypted moments require a non-empty password` instead of shipping the body as plaintext.

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
| Encryption | Yes, but the unlock isn't remembered | Yes, remembered per tab | No |

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

- Do I have to re-enter the password after refreshing an encrypted moment

  Yes. Moments don't remember the unlock, so a refresh or a return visit brings the password box back. Posts and albums remember it for the current tab.

- What happens with `encrypted: true` but no password

  The build stops with `Encrypted moments require a non-empty password`, so a missing password can't accidentally publish the body.
:::
