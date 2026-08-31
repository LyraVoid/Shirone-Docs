---
title: Folder Mode (Recommended)
createTime: 2026/09/01 02:15:00
permalink: /en/guide/writing/organization/folder/
---

Folder Mode is the **strongly recommended best practice** for organizing articles in Shirone.

In this layout, each post resides in its own dedicated directory with `index.md` (or `index.mdx`) as the entrypoint, co-locating cover images, screenshots, diagrams, and attachments right beside the article text.

::: tip Eliminate External Image Hosts
With Folder Mode, all your assets stay within your Git repository. Say goodbye to third-party image host outages, anti-hotlinking blocks, and rate limits.
:::

---

## Directory Structure

Create a folder named after your post slug in `src/content/posts/` (or the content repo's `posts/`):

::: file-tree

- src
  - content
    - posts
      - deep-learning-notes
        - index.md
        - cover.webp
        - loss-curve.png
        - model-architecture.svg
      - building-custom-theme
        - index.md
        - cover.jpg
        - demo.mp4
        - assets
          - code-snippet.ts
          - benchmark.json

:::

---

## Relative Asset References

Because images are co-located alongside `index.md`, you can reference them using standard relative paths:

### 1. Frontmatter Cover

```markdown title="src/content/posts/deep-learning-notes/index.md"
---
title: Deep Learning Training Notes
published: 2026-09-01
description: Documenting model convergence and hyperparameter tuning.
category: AI
tags: [PyTorch, Deep Learning]
image: ./cover.webp
pinned: true
draft: false
---
```

### 2. Body Markdown Embeds

Embed local images directly:

```markdown
# Convergence Analysis

Here is the loss curve after 100 epochs:

![Loss Curve](./loss-curve.png)

High-level model architecture:

![Architecture](./model-architecture.svg)
```

---

## Why Folder Mode is Recommended

| Dimension | Folder Mode (Self-Contained) | Third-Party Image Hosts |
| --- | --- | --- |
| **Data Ownership** | **100% Private & Version-Controlled** with Git | Dependent on external terms & storage quotas |
| **Reliability** | **Permanent & Stable**, deployed with your site | Subject to domain bans, hotlink blocks, or sunset |
| **Build Optimization** | Astro automatically optimizes images into WebP & `srcset` | Loaded as-is without integrated pipeline |
| **RSS Compatibility** | Feed generator automatically turns relative paths into canonical URLs | Prone to CORS or image proxy failures |
| **Asset Cleanup** | Deleting the folder cleans up all associated images cleanly | Orphaned images are difficult to audit in cloud buckets |
| **Offline Workflow** | Fully previewable while drafting offline | Fails without active internet connectivity |

---

## URL Route Resolution

- **Slug Mapping**: The folder name determines the URL route. For instance, `posts/deep-learning-notes/index.md` resolves to `/posts/deep-learning-notes/`.
- **Safe Renaming**: Changing the folder name updates the URL without breaking internal relative image links.

---

## Best Practices

1. **Consistent Cover Naming**: Standardize on `./cover.webp` or `./cover.png` for easy discovery.
2. **Subdirectories for Heavy Assets**: When an article contains many images, group them into an `images/` or `assets/` subfolder:
   ```text
   article-name/
   ├── index.md
   ├── cover.webp
   └── images/
       ├── step-1.png
       ├── step-2.png
       └── step-3.png
   ```
3. **Format Selection**: Prefer `.webp` for raster graphics and `.svg` for vector flowcharts.
