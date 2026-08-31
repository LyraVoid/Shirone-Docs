---
title: File Include
createTime: 2026/08/31 23:16:00
permalink: /en/guide/writing/markdown/include/
---

The file include syntax allows embedding entire external files, specified line ranges, or named regions directly into your Markdown document.

## Include Whole File

Use the HTML comment directive format:

```markdown
<!-- @include: ../snippets/prerequisites.md -->
```

## Include Specific Line Ranges

Import only lines 10 through 25 of a source file:

```markdown
<!-- @include: ../../src/config/siteConfig.ts{10-25} -->
```

## Include Named Regions

Mark code blocks with `#region` and `#endregion` comments:

```typescript title="src/example.ts"
// #region auth-config
export const authConfig = {
  enabled: true,
  provider: 'github',
};
// #endregion
```

Reference the region in your document:

```markdown
<!-- @include: ../../src/example.ts#auth-config -->
```

## Build Characteristics

- Includes resolve statically at compile time with zero runtime JavaScript footprint.
- Syntax highlighting and line numbers preserve full fidelity.
