---
title: Single File Mode
createTime: 2026/09/01 02:10:00
permalink: /en/guide/writing/organization/file/
---

Single File Mode is the baseline way to organize articles in Shirone. You create individual `.md` or `.mdx` files directly within `src/content/posts/` (or the content repository's `posts/` folder), with each file representing a standalone post.

## Ideal Use Cases

- **Prose, Essays & Text-Heavy Notes**: Quick articles that don't need dedicated local image bundles.
- **External Image Hosts & CDNs**: Users hosting covers and diagrams on S3, Cloudflare R2, Imgur, or specialized CDNs.
- **Fast Migration**: Seamlessly importing legacy Markdown files from Hexo, Hugo, VuePress, or Jekyll.

---

## Directory Structure

::: file-tree

- src
  - content
    - posts
      - my-first-post.md
      - guide-to-typescript.md
      - 2026-summary.mdx

:::

---

## Frontmatter Configuration

Add YAML frontmatter at the very top of your Markdown file:

```markdown title="src/content/posts/my-first-post.md"
---
title: My First Blog Post
published: 2026-09-01
description: An introduction written using Shirone Single File Mode.
category: Tech
tags: [Shirone, Astro, Svelte]
image: /images/cover/example.webp
pinned: false
draft: false
---

# Content starts here

This is a post created using the Single File Mode...
```

### Key Fields Reference

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `string` | **Yes** | Post title |
| `published` | `string \| Date` | **Yes** | Publication date (ISO format `YYYY-MM-DD` recommended) |
| `description` | `string` | No | Short excerpt shown in cards and SEO meta tags |
| `category` | `string` | No | Primary category (e.g. `Development`, `Diary`) |
| `tags` | `string[]` | No | Tag array (e.g. `[Astro, Svelte]`) |
| `image` | `string` | No | Cover image URL (public path `/images/...` or external `https://` link) |
| `pinned` | `boolean` | No | Pins post to the top of listings with a highlight badge |
| `draft` | `boolean` | No | When `true`, excluded from production builds |
| `permalink` | `string` | No | Custom permalink URL slug |

---

## Asset References

Since single files do not have dedicated subdirectories, media must be referenced as follows:

### 1. Site Public Directory (`public/`)

Store assets under `public/images/` and reference them with leading slashes:

```markdown
![Architecture Diagram](/images/posts/architecture.webp)
```

### 2. External Image Host / CDN

Directly pass the full URL:

```markdown
![Illustration](https://cdn.example.com/assets/illustration.png)
```

---

## URL Route Resolution

- **Default Convention**: Routes match file names automatically. For example, `src/content/posts/vue3-guide.md` resolves to `/posts/vue3-guide/`.
- **Custom Permalinks**: Override routes via frontmatter `permalink: "/posts/custom-slug/"` to decouple URLs from physical file names.

---

## Trade-offs

### Advantages

- **Flat & Simple**: All posts are directly visible in `posts/`.
- **Minimal Footprint**: Single standalone files are great for quick notes.
- **Portable**: Easily batch copied from other static site generators.

### Considerations

- **Scattered Assets**: Images placed in `public/` can accumulate over time and are difficult to clean up when deleting old articles.
- **For image-rich articles, [Folder Mode](/en/guide/writing/organization/folder/) is recommended**: Co-locating images alongside the article enables self-contained bundles and zero-external-image-host workflows.
