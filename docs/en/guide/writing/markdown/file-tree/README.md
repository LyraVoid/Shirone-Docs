---
title: File Tree
createTime: 2026/08/31 23:13:00
permalink: /en/guide/writing/markdown/file-tree/
---

The file tree component renders directory structures with automatic file-extension icon matching, collapsible directories, and diff status badges.

## Syntax

Supports both container and fenced block formats:

### Container Format

```markdown
::: file-tree{title="Shirone Project Structure"}
- src/
  - config/
    - siteConfig.ts
    - sidebarConfig.ts
  - content/
    - posts/
      - hello-world.md
  - astro.config.mjs
- package.json
- pnpm-lock.yaml
:::
```

### Fenced Block Format

```markdown
```file-tree title="Build Output"
dist/
├── assets/
│   ├── app.js
│   └── style.css
├── index.html
└── pagefind/
```
```

## Smart Features

- **Icon Matching**: Matches icons based on file extensions (`.ts`, `.json`, `.astro`, `.md`, `.css`, etc.).
- **Diff Annotations**: Prefixing items with `+` (added), `-` (removed), or `~` (modified) renders colored diff indicators.
- **Native Folding**: Directories support `<details>` folding interactions out of the box.
