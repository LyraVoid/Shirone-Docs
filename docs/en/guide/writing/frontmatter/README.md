---
title: Frontmatter & Post Management
createTime: 2026/08/31 23:10:00
permalink: /en/guide/writing/frontmatter/
---

Every post is a Markdown (or MDX) file under `src/content/posts/`, with YAML frontmatter at the top defining its metadata. This page covers all fields, draft and pinning management, and the post creation workflow.

## Creating a Post

```bash
pnpm new-post my-first-post
```

The command generates a template file with basic frontmatter under `src/content/posts/`. Edit the file to add your content.

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
| `updated` | `date` | No | Update time, triggering the "last updated" notice on the post page |
| `pinned` | `boolean` | No | `true` pins the post to the top of the list |
| `lang` | `string` | No | Declares the post language (e.g. `en`, `zh_CN`) |
| `comment` | `boolean` | No | Disable comments for this post (requires the comment system to be enabled) |
| `encrypted` | `boolean` | No | Marks the post as encrypted (see [Post Encryption](/en/guide/writing/encryption/)) |
| `password` | `string` | No | Encryption password; setting it implicitly enables encryption |
| `passwordHint` | `string` | No | Hint displayed under the password input |
| `hideHomeContent` | `boolean` | No | Used with encrypted posts: hides the summary and word count on index/archive/RSS |

## Draft Management

```yaml
draft: true
```

Posts with `draft: true` are in draft state: excluded from production builds and invisible to visitors. Drafts remain visible in the local dev server, which makes previewing easy.

To publish, simply change to `draft: false`.

## Pinning

```yaml
pinned: true
```

Pinned posts are placed at the top of the post list (pinned posts still sort by publish date among themselves).

## Categories and Tags

```yaml
tags: [Astro, Vue, Notes]
category: Tech
```

- One category per post (`category`), multiple tags allowed (`tags`)
- Both are aggregated automatically from post content—no separate registry to maintain; the categories page, tags page, and sidebar widgets read this data

## Image Path Rules

`image` and inline images all support three forms:

| Form | Example | Behavior |
| --- | --- | --- |
| Relative path | `./cover.webp` | Resolved relative to the post file, eligible for build optimization (recommended) |
| Absolute path | `/images/x.webp` | Relative to the `public` directory, output as-is |
| Remote URL | `https://cdn.example.com/x.webp` | Referenced as-is |

Using a post directory (`index.md` + assets in the same folder) is the recommended way to manage image-heavy posts—see [Image Gallery & File Organization](/en/guide/writing/gallery/).

## Time and Timezone

`published` / `updated` are interpreted and displayed according to the site's `timeZone` setting (see [Site Config](/en/guide/layout/site-config/)). A plain date (`2026-08-26`) is usually enough; write a full timestamp when you need precision.

## FAQ

**Post not showing**

Check in order: is `draft` `true` → is the frontmatter YAML valid (space after colons, consistent list indentation) → is the file under `src/content/posts/` → did you rebuild.

**Want to preview a draft locally without publishing**

Keep `draft: true` and preview with `pnpm dev`—dev mode shows drafts, while build output excludes them.

**Tags and categories pages are empty**

Those pages are aggregated from post data. Content appears once at least one post has `tags` / `category`.

**Post ordering is wrong**

Lists sort by `published` in descending order. When backfilling old posts, set `published` to the actual date to place them correctly.
