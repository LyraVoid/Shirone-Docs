---
title: Code Tabs
createTime: 2026/08/31 23:24:00
permalink: /en/guide/writing/codeblock/tabs/
---

Code Tabs enable readers to switch between multiple package managers (pnpm / npm / yarn / bun), programming languages, or operating system instructions within the same card.

## Syntax

Use `::: tabs` with `@tab` separators:

````markdown
::: tabs#package-managers

@tab pnpm#pnpm

```bash
pnpm install
pnpm build
```

@tab npm#npm

```bash
npm install
npm run build
```

@tab Bun#bun

```bash
bun install
bun run build
```

:::
````

## Features

- **Active Tab**: Mark default selected tabs with `@tab:active`.
- **Synchronized Grouping**: Tabs with identical `#id` values synchronize across the entire page when clicked.
- **Keyboard Navigation**: Accessible arrow-key switching between tab panels.
