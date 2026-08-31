---
title: Image Grid & Media
createTime: 2026/08/31 23:15:00
permalink: /en/guide/writing/markdown/image-grid/
---

Shirone provides responsive multi-column image galleries and inline width control with built-in Lightbox previews and automatic image optimization.

## Multi-Column Grid Gallery (grid)

Use the `::: grid` container to assemble photos into a structured responsive gallery:

```markdown
::: grid{columns="3" aspect="16/9" fit="cover"}
![Spring](./spring.webp "Cherry blossoms")
![Summer](./summer.webp "Sunny waves")
![Autumn](./autumn.webp "Maple pathway")
:::
```

### Parameters

- `columns`: Number of columns (`2`, `3`, `4`).
- `aspect`: Fixed aspect ratio (e.g., `16/9`, `4/3`, `1/1`).
- `fit`: Image fitting mode (`cover` or `contain`).

## Single Image Sizing and Captions

Annotate width parameters directly within the alt text string:

```markdown
![System Architecture w-60%](./architecture.webp "Data flow diagram")

![Logo w-120px](./logo.png "High resolution logo")
```

- `w-60%`: Constrains the image width to 60% of the content container and centers it.
- Text within quotation marks renders as the figure caption below.
