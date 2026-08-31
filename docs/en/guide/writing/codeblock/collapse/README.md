---
title: Collapsing & Copying
createTime: 2026/08/31 23:23:00
permalink: /en/guide/writing/codeblock/collapse/
---

To keep pages uncluttered when displaying lengthy configurations or boilerplate, Shirone offers code collapse attributes alongside one-click copy buttons.

## Code Collapsing (collapse)

Specify line ranges to collapse by default using `collapse={start-end}`:

````markdown
```typescript collapse={4-8} title="Config File Example"
import { defineUserConfig } from 'astro/config';

export default defineUserConfig({
  // Collapsed region start
  site: 'https://shirone.mysqil.com',
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  // Collapsed region end
  integrations: [],
});
```
````

Collapsed sections render as an interactive "Expand N lines" button that unfolds smoothly on user click.

## One-Click Copying

All code blocks include a built-in copy button in the upper right corner:
- Copies pure code text directly to the system clipboard without line numbers or decoration artifacts.
- Displays immediate visual confirmation upon copying.
