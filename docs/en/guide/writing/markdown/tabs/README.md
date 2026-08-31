---
title: Code Tabs
createTime: 2026/08/31 23:35:00
permalink: /en/guide/writing/markdown/tabs/
---

Code Tabs (Code Groups) allow readers to switch between multiple programming languages, package managers, or environments within a unified card.

## Syntax

Use the `::: tabs` container with `@tab` separators:

````markdown
::: tabs#package-managers

@tab pnpm#pnpm

```bash
pnpm install
pnpm dev
```

@tab npm#npm

```bash
npm install
npm run dev
```

@tab Bun#bun

```bash
bun install
bun dev
```

:::
````

## Key Features

- **Active Tab**: Mark default selected tabs with `@tab:active`.
- **Synchronized Grouping**: Tabs sharing identical `#id` values synchronize globally when toggled.
- **Keyboard Navigation**: Accessible arrow-key switching between tab panels.
