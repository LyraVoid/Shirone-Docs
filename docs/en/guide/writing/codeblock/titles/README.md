---
title: Titles & File Names
createTime: 2026/08/31 23:21:00
permalink: /en/guide/writing/codeblock/titles/
---

By specifying `title="..."` in the code fence metadata, Shirone renders an operating-system-styled header bar with file extension icons.

## Syntax

Add `title="..."` to the code fence header:

````markdown
```json title="package.json"
{
  "name": "shirone",
  "version": "1.0.0"
}
```
````

For terminal commands:

````markdown
```bash title="Terminal Commands"
pnpm install
pnpm dev
```
````

## Visual Layout

- Renders OS-styled window controls on the left alongside the matched file extension icon.
- Places the one-click copy button and collapse toggles neatly on the right.
- Enhances readability by communicating target file locations.
