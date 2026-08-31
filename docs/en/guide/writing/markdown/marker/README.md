---
title: Marker Highlights
createTime: 2026/08/31 23:05:00
permalink: /en/guide/writing/markdown/marker/
---

The marker highlight syntax provides vibrant highlighter effects for phrases within paragraphs, rendered as native semantic `<mark>` tags.

## Basic Syntax

Wrap phrases with double equal signs `==`:

```markdown
Use ==primary theme highlights== to emphasize key takeaways in your articles.
`

**Rendered Preview**: Use ==primary theme highlights== to emphasize key takeaways in your articles.``

## Semantic Color Suffixes

Append class suffixes to specify semantic color roles:

```markdown
==Secondary emphasis state=={.secondary}

==Critical errors and conditions=={.error}

==Tips and recommendations=={.tip}

==Tertiary palette accent=={.tertiary}
```

## Highlights

- Generates standard `<mark>` HTML elements for screen reader accessibility.
- Highlight background colors are dynamically derived from Material 3 Expressive semantic color tokens.
- Zero client-side JavaScript execution.
