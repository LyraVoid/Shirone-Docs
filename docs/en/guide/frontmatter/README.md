---
title: Frontmatter
createTime: 2026/08/31 23:10:00
permalink: /en/guide/frontmatter/
---

Every post is a Markdown (or MDX) file under `src/content/posts/`, with YAML frontmatter at the top defining its metadata. This page is the reference manual for all fields; for creation workflows and file organization see [Writing Posts](/en/guide/writing-post/).

## What Is Frontmatter

Frontmatter is a YAML configuration block at the top of a Markdown file, wrapped by `---` delimiters. Body content starts after the second `---`:

```yaml title="src/content/posts/my-first-post.md"
---
title: My First Post
published: 2026-08-26
description: A short summary shown in the post list and metadata.
image: ./cover.webp
tags: [Astro, Notes]
category: Writing
draft: false
---

Body content starts here.
```

## Field Reference

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `string` | Yes | Post title |
| `published` | `date` | Yes | Publish date, used for sorting and display |
| `description` | `string` | No | Summary shown in post list cards and metadata |
| `image` | `string` | No | Cover image. Relative path (`./cover.webp`), `public` absolute path (`/img/x.webp`), or remote URL |
| `tags` | `array` | No | Tags, powering the tags page and sidebar tag cloud |
| `category` | `string` | No | Category, powering the categories page and sidebar widget |
| `draft` | `boolean` | No | `true` marks the post as a draft, invisible to visitors |
| `updated` | `date` | No | Update time, triggering the "last updated" notice |
| `pinned` | `boolean` | No | `true` pins the post to the top of the list |
| `lang` | `string` | No | Declares the post language (e.g. `en`, `zh_CN`) |
| `comment` | `boolean` | No | Disable comments for this post (requires the comment system enabled) |
| `encrypted` | `boolean` | No | Marks the post as encrypted |
| `password` | `string` | No | Encryption password; setting it implicitly enables encryption |
| `passwordHint` | `string` | No | Hint displayed under the password input |
| `hideHomeContent` | `boolean` | No | Used with encrypted posts: hides the summary and word count on index/archive/RSS |

## Field Groups

### Basic Metadata

`title` and `published` are the only required fields: the title appears in lists and on the post page, and the publish date determines ordering. When `description` is omitted, list cards fall back to a body excerpt—fill it in explicitly for controlled presentation.

### Content Association

`image`, `tags`, and `category` together shape the post's appearance and entry points:

- The cover image appears on post cards; without one, the default style is used
- A post can have multiple tags but only one category; both are aggregated automatically across all posts—no separate registry to maintain

### State Control

| Field | Effect |
| --- | --- |
| `draft: true` | Draft: excluded from production builds, visible in dev |
| `pinned: true` | Pinned: placed at the top of the post list |
| `updated` | Shows a "last updated" notice on the post page |
| `lang` | Declares the post language; does not affect the UI language |
| `comment: false` | Disables comments for this post |

### Encryption Fields

`encrypted` / `password` / `passwordHint` / `hideHomeContent` serve the post encryption system. Setting `password` implicitly enables encryption—no need to also write `encrypted: true`.

## Image Path Rules

`image` and body images support three forms:

| Form | Example | Behavior |
| --- | --- | --- |
| Relative path | `./cover.webp` | Resolved relative to the post file, eligible for build optimization (recommended) |
| Absolute path | `/images/x.webp` | Relative to the `public` directory, output as-is |
| Remote URL | `https://cdn.example.com/x.webp` | Referenced as-is |

## Time and Timezone

`published` / `updated` are interpreted and displayed according to the site's `timeZone` setting (see [Site Config](/en/guide/layout/site-config/)). A plain date (`2026-08-26`) is usually enough; write a full timestamp when you need precision.

## YAML Syntax Notes

- A space is required after the colon: `title: correct`; `title:wrong` is treated as a string
- Quote values containing special characters: `password: "my-secret"`
- Two list forms are equivalent: `tags: [A, B]` or line-by-line `- A` `- B`, with consistent indentation
- Field names are case-sensitive: `Title` is not `title`

## FAQ

**What happens if frontmatter is written wrong**

YAML syntax errors fail the build with the file and line number; misspelled field names are silently ignored (the field falls back to its default). Run `npx astro check` after changes.

**Can I add custom fields**

Fields the theme doesn't recognize are ignored (no error). If you need them for build scripts, put the data in body text or a data file instead.

**description vs. the first paragraph**

`description` takes priority for list cards, SEO meta, and RSS; without it, a body excerpt is used. They serve different purposes: description is the reader-facing preview, the first paragraph is content.
---
title: Frontmatter & Post Management
createTime: 2026/08/31 23:10:00
permalink: /en/guide/frontmatter/
---

Every post is a Markdown (or MDX) file under `src/content/posts/`, with YAML frontmatter at the top defining its metadata. This page covers all fields, draft and pinning management, and the post creation workflow.

## Creating a Post

```bash
pnpm new-post my-first-post
```

The command generates a template file with basic frontmatter under `src/content/posts/`.

## Frontmatter Field Reference

```yaml title="src/content/posts/my-first-post.md"
---
title: My First Post
published: 2026-08-26
description: A short summary shown in the post list and metadata.
image: ./cover.webp
tags: [Astro, Notes]
category: Writing
draft: false
---
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `string` | Yes | Post title |
| `published` | `date` | Yes | Publish date, used for sorting and display |
| `description` | `string` | No | Summary shown in post list cards and metadata |
| `image` | `string` | No | Cover image. Relative path (`./cover.webp`), `public` absolute path (`/img/x.webp`), or remote URL |
| `tags` | `array` | No | Tags, powering the tags page and sidebar tag cloud |
| `category` | `string` | No | Category, powering the categories page and sidebar widget |
| `draft` | `boolean` | No | `true` marks the post as a draft, invisible to visitors |
| `updated` | `date` | No | Update time, triggering the last updated notice on the post page |
| `pinned` | `boolean` | No | `true` pins the post to the top of the list |
| `lang` | `string` | No | Declares the post language (e.g. `en`, `zh_CN`) |
| `comment` | `boolean` | No | Disable comments for this post |
| `encrypted` | `boolean` | No | Marks the post as encrypted |
| `password` | `string` | No | Encryption password; setting it implicitly enables encryption |
| `passwordHint` | `string` | No | Hint displayed under the password input |
| `hideHomeContent` | `boolean` | No | Used with encrypted posts: hides the summary and word count on index/archive/RSS |

## Draft Management

```yaml
draft: true
```

Posts with `draft: true` are in draft state: excluded from production builds and invisible to visitors. Drafts remain visible in the local dev server for previewing.

To publish, change to `draft: false`.

## Pinning

```yaml
pinned: true
```

Pinned posts are placed at the top of the post list.

## Categories and Tags

```yaml
tags: [Astro, Svelte, Notes]
category: Tech
```

- One category per post (`category`), multiple tags allowed (`tags`).
- Both are aggregated automatically from post content.

## Image Path Rules

| Form | Example | Behavior |
| --- | --- | --- |
| Relative path | `./cover.webp` | Resolved relative to the post file, eligible for build optimization |
| Absolute path | `/images/x.webp` | Relative to the `public` directory, output as-is |
| Remote URL | `https://cdn.example.com/x.webp` | Referenced as-is |

## Time and Timezone

`published` / `updated` are interpreted and displayed according to the site's `timeZone` setting (see [Site Config](/en/guide/layout/site-config/)).
