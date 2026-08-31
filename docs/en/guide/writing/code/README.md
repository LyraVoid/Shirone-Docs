---
title: Code Display
createTime: 2026/08/31 23:13:00
permalink: /en/guide/writing/code/
---

Code is the centerpiece of technical articles. Shirone builds on Expressive Code to provide enhanced code blocks (syntax highlighting, line decorations, collapsible sections, line numbers), two file tree syntaxes, and multi-file code trees that give readers an IDE-like experience for multi-file examples. Light/dark code themes are configured in `expressiveCodeConfig.ts`.

## Enhanced Code Blocks (Expressive Code)

Standard fenced code blocks automatically get syntax highlighting, a copy button, line numbers, and light/dark theme adaptation:

````
```typescript
import { decryptProtectedContent } from "@/utils/password-protection"

async function unlock(payload, password): Promise<string> {
    return decryptProtectedContent(payload, password, payload.scope)
}
```
````

Expressive Code line decorations (highlighted lines, diff markers, filename titles, etc.) are available through fence metadata and inline markers; themes are switched via `src/config/expressiveCodeConfig.ts`.

## File Trees

### Nested List Syntax (`:::file-tree`)

Write directory structures directly as a Markdown nested list:

````markdown
:::file-tree{title="Shirone source tree"}
- src
  - components/
    - ++ Navigation.svelte # added component
    - -- Button.astro # removed component
  - content
    - posts/
  - **content.config.ts** # important file
- public/
- package.json
:::
````

Marker rules:

- `++` / `--` prefixes: green added / red removed (diff highlighting)
- Text after `#`: muted right-aligned inline comment
- `**bold**`: prominent emphasis for key files
- Trailing slash on a directory (e.g. `components/`): collapsed by default, expandable on click (expanded by default without the slash)

### Terminal Output Syntax (```` ```file-tree ````)

Paste output from `tree` or similar tools into a `file-tree` fenced block. Unicode branch characters (`├──`, `└──`, `│`) and ASCII branches are parsed automatically:

````markdown
```file-tree title="Build output" icon="simple"
dist
├── _astro/
│   ├── index.css
│   └── page.js
└── favicon.ico
```
````

Options: `title="Title"` sets the header; `icon="colored" | "simple"` switches between colorful and monochrome file icons (colored by default).

## Code Trees

A file hierarchy navigation pane on the left paired with an instant code panel on the right—ideal for multi-file examples.

### Container Syntax (`:::code-tree`)

Combine multiple fenced code blocks inside a `:::code-tree`. Each block declares its path via `title="path"`:

````markdown
:::code-tree{title="Component Demo" height="380px" entry="src/Button.svelte"}
```svelte title="src/Button.svelte"
<button class="m3-btn">{label}</button>
```

```stylus title="src/styles/button.styl"
.m3-btn
  background: var(--primary)
```

```json title="package.json"
{
  "name": "button-demo"
}
```
:::
````

Options:

- `title="Title"`: header title
- `height="380px"`: desktop height (default `420px`; units like `26rem` work)
- `entry="path"`: the file active on first load
- `icon="colored" | "simple"`: file icon style
- Add `:active` to any fenced block to designate it as the default active tab

### Local Directory Auto-Import (`@[code-tree]`)

Point directly at a local directory; the build scans it and generates an interactive code tree—no manual copying:

```markdown
@[code-tree title="Site Configuration" entry="siteConfig.ts"](/src/config)
```

## Choosing the Right Syntax

| Scenario | Recommended |
| --- | --- |
| A single code snippet | Enhanced code block |
| Showing project structure | `:::file-tree` or the `file-tree` fence |
| Comparing up to 3 files | Multiple blocks with filename titles |
| Walking through a multi-file module | `:::code-tree` or `@[code-tree]` |

## FAQ

**Does `#` inside file-tree always become a comment**

Only text at the **end of an entry** renders as a comment (e.g. `- file.ts # note`). Avoid `#` in directory names themselves.

**The code tree is too short for the code**

Adjust with `height` (e.g. `height="500px"`). Mobile switches to a vertical layout automatically—no separate handling needed.

**`@[code-tree]` reports a path error**

The path must be a directory inside the repository (a repo-root-relative path starting with `/`). Missing directories or unsupported file types keep the original markup.

**Code block theme doesn't follow the site's light/dark mode**

Check the theme configuration in `expressiveCodeConfig.ts`; the build generates styles for both light and dark themes.
