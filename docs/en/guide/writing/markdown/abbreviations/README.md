---
title: Abbreviations
createTime: 2026/08/31 23:07:00
permalink: /en/guide/writing/markdown/abbreviations/
---

The abbreviation syntax allows defining terminology dictionaries within an article, rendering clean semantic `<abbr>` elements with instant hover popovers.

## Syntax

Declare term mappings anywhere in your Markdown file:

```markdown
*[SSR]: Server-Side Rendering
*[LCP]: Largest Contentful Paint
*[AST]: Abstract Syntax Tree
```

Use the terms naturally in your prose:

```markdown
Adopting SSR helps keep LCP low and performs transforms at AST compile stage.
```

## Features

- **Automatic Linking**: All matching terms within the document automatically receive abbreviation underlines and popovers.
- **Top-Layer Positioning**: Leverages native Popover top-layer and CSS Anchor positioning so tooltips are never clipped by parent overflow boundaries.
- **On-Demand Loading**: Interactive styles and scripts load only when abbreviation syntax is present in the post.
