---
title: Writing Posts
createTime: 2026/08/31 23:16:00
permalink: /en/guide/writing-post/
---

This page covers the full post lifecycle: creation, file organization, drafts and publishing, pinning and ordering, categories and tags. For the meaning of each field see [Frontmatter](/en/guide/frontmatter/); for enhanced body syntax see the [Writing](/en/guide/writing/markdown/basic/) section.

## Creating a Post

```bash
pnpm new-post my-first-post
```

The command generates a template file with basic frontmatter under `src/content/posts/`. Open it, fill in `title`, `published` and other fields, and write the body after the second `---`.

You can also create the Markdown file by hand—the template just saves repetitive typing.

## File Organization

All posts live under `src/content/posts/`, in two shapes:

**Single file (few images)**

```file-tree title="Posts Directory Structure"
src/content/posts/
├── hello-world.md
└── vue-tips.md
```

**Directory + index.md (image/resource heavy)**

```file-tree title="Posts Directory Structure"
src/content/posts/
└── my-gallery/
    ├── index.md            # post body
    ├── cover.webp          # cover (frontmatter: image: ./cover.webp)
    ├── photo-1.webp
    └── photo-2.webp
```

The directory form keeps images next to the post with relative-path references—moving or deleting a post handles its assets at once, leaving no orphans. Prefer this shape for image-heavy posts.

::: tip Naming Advice
The file name becomes part of the URL (the slug). Prefer English kebab-case (`my-first-post`); Chinese file names work but the URL gets encoded. The file name and `title` are independent—the title can be as long as you like.
:::

> [!TIP]
> **File Naming Best Practices**
> File names become the URL slug. Use lowercase kebab-case (e.g. `my-first-post`). The filename is decoupled from the post `title`.

## Drafts and Publishing

```yaml
draft: true   # draft: excluded from builds
draft: false  # published
```

Recommended workflow:

::: steps

1. **Create the draft**: after `pnpm new-post`, set `draft` to `true`.
2. **Preview locally**: run `pnpm dev`—drafts are visible in dev mode, so you can check the layout anytime.
3. **Publish**: once the content is ready, change `draft` to `false`, commit, and push to trigger deployment.

:::

## Ordering and Pinning

Post lists sort by `published` in descending order. Two controls:

- **Pin**: `pinned: true` places the post at the top (pinned posts still sort by publish date among themselves)
- **Backfilling old posts**: set `published` to the actual date to place them correctly—no file migration needed

## Categories and Tags

```yaml
tags: [Astro, Svelte, Notes]
category: Tech
```

- One category per post (`category`), multiple tags allowed (`tags`)
- Both are aggregated automatically across all posts—no separate registry to maintain; the categories page, tags page, and sidebar widgets read this data
- Reuse existing tag vocabulary; avoid synonymous tags (like "JS" and "Javascript") splitting the aggregation pages

## Working with Images

`image` (cover) and body images support relative paths, `public` absolute paths, and remote URLs—see [Frontmatter image path rules](/en/guide/frontmatter/#image-path-rules). For batch display use the `:::grid` gallery syntax, see [Image Grid & Media](/en/guide/writing/markdown/image-grid/).

## FAQ

::: collapse
- Post not showing

  Check in order: is `draft` `true` → is the frontmatter YAML valid (space after colons, consistent indentation) → is the file under `src/content/posts/` → did you rebuild.

- Want to preview a draft locally without publishing

  Keep `draft: true` and preview with `pnpm dev`—dev mode shows drafts, build output excludes them.

- Tags and categories pages are empty

  Those pages are aggregated from post data. Content appears once at least one post has `tags` / `category`.

- Does the new-post file name matter

  It determines the URL slug. English kebab-case is the safest; renaming a file changes the post's address—be cautious with indexed posts.
:::
