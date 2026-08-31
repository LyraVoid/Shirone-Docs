---
title: Markdown Basics & Enhancements
createTime: 2026/08/31 23:11:00
permalink: /en/guide/writing/markdown/
---

Shirone supports standard Markdown and MDX, plus a set of theme-exclusive enhancement syntaxes. All enhancements render into accessible, semantic HTML **at build time** with zero client-side hydration overhead. This page covers admonitions, markers, abbreviations, collapse panels, tabs, steps and more; for diagrams and media see [Diagrams & Media Embeds](/en/guide/writing/media/).

## Admonitions

Seven types: `note` `info` `tip` `important` `warning` `caution` `details`.

```markdown
:::note
An admonition with the default title.
:::

:::tip[Custom Title]
Square brackets set a custom title.
:::

::: warning Space Title
The space form is also supported.
:::
```

GitHub-style alerts are supported too:

```markdown
> [!IMPORTANT]
> The GitHub alert syntax.
```

## Markers

Highlight phrases with `==double equals==`, with semantic variants:

```markdown
==Default primary color==
==Secondary emphasis=={.secondary}
==Conditions that need fixing=={.error}
```

Available suffixes: `.primary`, `.secondary`, `.tertiary`, `.error`, `.tip`.

## Abbreviations

Define terms within a post; matching terms in the body show a tooltip on hover:

```markdown
*[SSR]: Server-Side Rendering
*[LCP]: Largest Contentful Paint

SSR-first output should keep LCP stable.
```

Terms must start with a letter or digit, up to 48 characters. Definitions only apply to the current post and are not rendered as body text.

## Collapse Panels

```markdown
::: collapse accordion
- :+ Title expanded by default

  Paragraphs, lists, quotes and code blocks are supported.

- Second title

  Opening this item automatically closes the previous one in the accordion.
:::
```

- `accordion` mode allows only one open item; the default mode allows multiple
- `:+` / `:-` prefixes override the initial expand/collapse state per item

## Option Groups (Tabs)

```markdown
::: tabs#runtime

@tab Node.js#node

Full Markdown body for Node.js.

@tab:active **Bun**#bun

Full Markdown body for Bun.

:::
```

- `@tab:active` sets the initial item; the trailing `#value` is the sync key
- Option groups sharing the same key **switch in sync**, and the reader's choice is remembered in localStorage
- When scripts are unavailable, all panel content remains readable (SSR never pre-hides it)

## Steps

Render one ordered list as a numbered step flow:

````markdown
:::steps[Deployment]
1. **Clone the repository**

   ```bash
   git clone https://github.com/LyraVoid/Shirone.git
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```
:::
````

Options: `:::steps[Title]` or `title="Title"` adds a visible label; `start=4` changes the first step number. The container must hold exactly one ordered list.

## Spoilers

Hide a short inline answer, revealed on hover/focus/click:

```markdown
The answer is :spoiler[**42**].
```

Generates a native button with `aria-expanded`; hover and focus reveal the text even without JavaScript.

## Content Annotations

Attach supporting notes next to a sentence without interrupting the reading flow:

```markdown
Astro renders static pages and hydrates **interactive islands** [+islands] on demand.

[+islands]:
  An island is an interactive component surrounded by static HTML.
```

One label can have multiple definitions; undefined references (like `[+missing]`) stay as plain text.

## Math (KaTeX)

```markdown
Inline: $\omega = d\phi / dt$

Display math gets its own line:
$$I = \int \rho R^{2} dV$$
```

## Field Cards

API and component parameter documentation cards, great for configuration references:

```markdown
:::: field-group

::: field output
@type 'svg' | 'chtml'
@default 'svg'
@optional

Output format.
:::

::::
```

`@type` / `@default` render as code tokens; `@required` / `@optional` / `@deprecated` render as status badges.

## File Includes

Expand local Markdown snippets into the current post at build time:

```markdown
<!-- @include: ../snippets/example.md -->
<!-- @include: ../snippets/example.md{2-6} -->   line range
<!-- @include: ../snippets/example.md#region --> named region
```

Line numbers start at 1 and include both ends; regions are delimited by `#region name` / `#endregion` in the source file. Include comments inside code fences are not expanded.

## Standard Syntax Notes

These standard features work out of the box: headings, bold/italic, inline code, fenced code blocks (syntax highlighted), blockquotes, ordered/unordered lists, task lists, tables, footnotes (`[^1]`), links and images, horizontal rules.

## FAQ

**An enhancement renders as-is**

Most container syntaxes have strict structure requirements (e.g. steps must hold exactly one ordered list; tabs need at least two options per group). Invalid input is **intentionally kept as ordinary Markdown** rather than parsed heuristically—fix the structure against the examples above.

**Changes don't take effect in dev**

Astro dev may serve stale Markdown compilation results (new CSS appears but the new DOM structure does not—a typical signal). Stop the dev server, delete `.astro/data-store.json`, and restart.

**KaTeX errors**

Check dollar-sign pairing and LaTeX syntax; avoid spaces between `$` and the formula (`$\omega$` works, `$ \omega $` may not parse).
