---
title: Attributes & Directives
createTime: 2026/08/31 23:01:00
permalink: /en/guide/writing/markdown/attributes/
---

Shirone allows attaching attribute dictionaries to Markdown elements to assign custom classes, IDs, or data attributes to the generated HTML markup.

## Inline Element Attributes

Attach `{}` directly after inline elements:

```markdown
[External Link](https://example.com){target="_blank" rel="noopener"}

==Highlighted text=={.secondary}

`code phrase`{.custom-badge}
```

## Block Element Attributes

Declare attributes on block containers or headings:

```markdown
## Custom Anchor Heading {#custom-section-id}

::: tip[Custom Container]{class="custom-highlight-box"}
Container contents
:::
```

## Shorthand Rules

- `.class-name`: Shorthand for `class="class-name"`
- `#id-name`: Shorthand for `id="id-name"`
- `key="value"`: Standard HTML attribute definition
