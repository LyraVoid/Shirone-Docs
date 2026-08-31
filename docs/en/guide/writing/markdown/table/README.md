---
title: Responsive Tables
createTime: 2026/08/31 23:04:00
permalink: /en/guide/writing/markdown/table/
---

Shirone enhances standard GitHub Flavored Markdown tables by automatically generating responsive scrollable containers and token-driven styling during the build process.

## Standard Syntax

```markdown
| Feature | Status | Default | Description |
| :--- | :---: | :---: | --- |
| Dynamic Color | Stable | 315 | Default seed hue |
| Swup Navigation | Enabled | true | Smooth page transitions |
| Zero Overhead | Strict | true | Zero bundle bloat when disabled |
```

## Text Alignment

- `:---`: Left align
- `:---:`: Center align
- `---:`: Right align

## Mobile Responsive Behavior

On mobile devices or narrow viewports:
- Build-time rehype plugins wrap tables in responsive containers with horizontal scroll bars.
- Prevents horizontal viewport overflow on mobile screens.
- Headers and zebra-striping strictly adhere to Material 3 Expressive surface design tokens.
