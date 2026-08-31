---
title: Content Annotations
createTime: 2026/08/31 23:08:00
permalink: /en/guide/writing/markdown/annotations/
---

Content annotations provide an interactive sidenote system superior to traditional bottom-of-page footnotes, linking inline tags with margin cards.

## Syntax

Place `[+tag]` markers in your prose and define annotation blocks below:

```markdown
Astro leverages an islands architecture [+islands] to keep initial loads instant.

[+islands]:
  Islands architecture refers to interactive UI components embedded within pure static HTML.
```

## Behavior

- **Inline Badges**: Markers render as subtle clickable indicator badges.
- **Desktop Sidenotes**: On wide viewports, annotations display in the right margin column.
- **Mobile Modals**: On mobile touchscreens, tapping a badge opens a modal popover.
- **SSR Pre-rendered**: Content is fully pre-rendered in static HTML for accessibility.
