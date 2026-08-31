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
