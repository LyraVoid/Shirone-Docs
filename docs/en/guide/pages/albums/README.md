---
title: Albums Page
createTime: 2026/11/04 00:00:00
permalink: /en/guide/pages/albums/
---

The albums page (`/albums/`) is a data-driven masonry gallery: no code required — drop photos into a directory and add an `info.json`. Three modes are supported: local photos, external image hosts, and password protection.

![Album overview with large cover cards](/images/content-separation/03-content/03-albums/01-albums-masonry-preview.png)
*Cover cards on the album overview page*

![Masonry gallery inside an album](/images/content-separation/03-content/03-albums/02-albums-masonry-detail-preview.png)
*Masonry photo gallery inside an album*

## Content location

Create one folder per album under `public/images/albums/` in the content repo. The folder name becomes the path identifier:

```file-tree title="Albums content directory"
public/images/albums/
├── KyotoTrip/            # album folder (path identifier)
│   ├── info.json         # album metadata, required
│   ├── cover.webp        # cover image
│   ├── 01.webp           # photos named by number
│   └── 02.webp
```

Every album folder must contain an `info.json`.

## Three modes

### Local photo album

Place photos directly in the album folder. All images named by number are picked up automatically at build time:

```json
{
  "title": "Kyoto Trip",
  "description": "Rainy morning in Sanneizaka",
  "date": "2026-08-15",
  "location": "Kyoto, Japan",
  "tags": ["travel", "photography"],
  "layout": "masonry",
  "columns": 3,
  "hidden": false
}
```

::: tip
Name photos with zero-padded numbers (`01.webp`, `02.webp`, …) to control their display order.
:::

### External photo album

When photos live on an external image host or object storage, set `mode: "external"` and declare them in the `photos` list:

```json
{
  "mode": "external",
  "title": "Landscape Collection",
  "cover": "https://img.example.com/cover.webp",
  "layout": "masonry",
  "columns": 3,
  "photos": [
    {
      "src": "https://img.example.com/photo1.webp",
      "title": "Sunrise on the summit",
      "description": "First light on the snow peak",
      "width": 1920,
      "height": 1080
    },
    {
      "src": "https://img.example.com/photo2.webp",
      "title": "Milky Way",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

::: tip
Provide `width` and `height` for each photo whenever possible, so the masonry layout does not shift on first paint.
:::

### Encrypted album

Add a `password` field to `info.json` to create a private album. Visitors must enter the correct password to view the full-size photos:

```json
{
  "title": "Family Album",
  "description": "Family gathering records",
  "date": "2026-08-20",
  "password": "your_private_password",
  "layout": "masonry",
  "columns": 3
}
```

## Common properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `string` | `"masonry"` | Layout: `"masonry"` or `"grid"` (equal-height grid) |
| `columns` | `number` | `3` | Desktop column count, `1`–`6` |
| `hidden` | `boolean` | `false` | `true` hides the album from the overview but keeps direct links working |
| `cover` | `string` | — | Custom cover image path; falls back to `cover.webp` or the first photo |

## Next steps

[Standalone Pages Overview](/en/guide/pages/pages-overview/): the toggle system and navigation wiring of the other standalone pages.
