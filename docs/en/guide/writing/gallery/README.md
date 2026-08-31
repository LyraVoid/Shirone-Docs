---
title: Image Gallery & File Organization
createTime: 2026/08/31 23:14:00
permalink: /en/guide/writing/gallery/
---

`:::grid` is the image gallery container: it arranges ordinary Markdown images into a responsive grid with a consistent card ratio and automatically enables lightbox viewing. This page also covers how to organize files for image-heavy posts.

## Minimal Syntax

````markdown
:::grid
![Image description](./image-1.webp)

![Image description](./image-2.webp)
:::
````

Rules: each image occupies its own paragraph (blank lines between images); keep only images inside the container—write paragraphs, lists, and code blocks outside.

## Parameters

Write parameters in braces after the opening directive: `:::grid{param="value"}`.

| Parameter | Allowed values | Default | Purpose |
| --- | --- | --- | --- |
| `columns` | Integers from `1` to `6` | `3` | Number of columns per row on desktop. Invalid values fall back to `3`. |
| `aspect` | A positive ratio, such as `16/9`, `3/4`, `1/1` | `16/10` | The displayed card ratio, not the original image ratio. |
| `fit` | `cover`, `contain` | `cover` | `cover` crops to fill; `contain` preserves the full image and may leave empty space. |

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![First image](./image-1.webp "Optional caption")

![Second image](./image-2.webp)
:::
````

## Captions and Alt Text

An image's alt text serves both as the accessible alternative text and its default caption; when a title is present, the title takes precedence:

```markdown
![Text used for accessibility](./image.webp "Caption shown below the image")
```

Captions align to the bottom within each row; a wrapping caption does not push other cards out of alignment.

## Layout and Cropping

Responsive rules: desktop uses the specified `columns`; below 768px grids use at most two columns; below 480px they switch to one column.

- `cover` (recommended default): center-crops images to fill cards for a consistent gallery look
- `contain`: shows the complete original without cropping—when ratios differ, the theme background shows through. Use for images that cannot be cropped (long screenshots, images with critical edge content)
- To display fully without empty space: set `aspect` close to the original ratio, or use a single column

## Lightbox Navigation

Click any image in a grid to open the Fancybox lightbox: zoom, rotate, fullscreen, thumbnails, and arrow-key navigation. **Navigation is limited to the current `:::grid` container**—each gallery is its own lightbox group and never mixes with other images in the post.

## File Organization: Recommended Structure for Image-Heavy Posts

Use a "directory + index.md" structure for image-heavy posts, keeping assets next to the post:

```text
src/content/posts/
├── my-trip.md              # post with few images
└── my-gallery/             # image-heavy post
    ├── index.md            # post body
    ├── cover.webp          # cover (frontmatter image: ./cover.webp)
    ├── photo-1.webp
    ├── photo-2.webp
    └── photo-3.webp
```

Reference images with relative paths: `![description](./photo-1.webp)`. Benefits: images move with the post, deleting a post leaves no orphaned assets, and the frontmatter cover is simply `./cover.webp`.

::: tip Format Advice
Prefer `.webp` in production (small size, good quality). Compress oversized originals first—`cover` mode crops the display, but the full original is still loaded (for the lightbox).
:::

## Practical Examples

**Three-column landscape gallery**

````markdown
:::grid{columns="3" aspect="16/9"}
![Landscape one](./landscape-1.webp "First")

![Landscape two](./landscape-2.webp "Second")

![Landscape three](./landscape-3.webp "Third")
:::
````

**Two-column large previews**

````markdown
:::grid{columns="2" aspect="1/1"}
![Square one](./square-1.webp)

![Square two](./square-2.webp)
:::
````

**An uncroppable long screenshot**

````markdown
:::grid{columns="1" aspect="16/9" fit="contain"}
![Full screenshot](./screenshot.webp "Click to view the original")
:::
````

## FAQ

**The gallery doesn't render; images stack vertically**

Check that `:::grid` and `:::` are paired, images are separated by blank lines, and nothing else is inside the container—invalid structures are kept entirely as ordinary Markdown.

**Important content got cropped away**

That's the price of `cover`'s center crop. Switch to `fit="contain"`, or keep critical details away from image edges (and give edge-critical images clear captions so readers open the lightbox for the original).

**Why doesn't my column count apply below 480px**

Responsive rules are enforced: at most two columns below 768px and one column below 480px for mobile readability. This cannot be overridden.

**Can I go beyond six columns**

`columns` is capped at 6. For denser thumbnails, split into multiple galleries (independent lightbox groups actually navigate better).
