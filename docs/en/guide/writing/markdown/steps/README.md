---
title: Step Guides
createTime: 2026/08/31 23:12:00
permalink: /en/guide/writing/markdown/steps/
---

The `steps` container transforms ordered lists into connected, numbered visual stepper flows, ideal for setup tutorials and installation procedures.

## Syntax

Wrap standard Markdown ordered lists inside `::: steps`:

````markdown
::: steps{title="Three-Step Quickstart"}

1. **Install Dependencies**

   Ensure Node.js `>= 22.12` and pnpm are installed.

2. **Clone and Initialize**

   ```bash
   git clone https://github.com/LyraVoid/Shirone.git
   cd Shirone
   pnpm install
   ```

3. **Start Development Server**

   Run `pnpm dev` and visit `http://localhost:4321`.

:::
````

## Features

- Numbered circle badges and connecting vertical lines are styled using Material 3 design tokens while retaining semantic `<ol>` structure.
- Supports nesting paragraphs, code snippets, alerts, and images within each individual step.
