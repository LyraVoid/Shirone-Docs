---
title: Admonition Containers
createTime: 2026/08/31 23:09:00
permalink: /en/guide/writing/markdown/admonitions/
---

Admonition containers highlight contextual notices, warnings, and collapsible notes using Material 3 Expressive surface containers.

## Syntax

Both bracket titles and space-separated titles are supported:

```markdown
::: tip[Helpful Tip]
Run type checks before modifying core configurations.
:::

::: warning Check Before Deploy
Ensure your production domain is set in siteConfig before deploying.
:::

::: info Documentation Reference
Read the content separation guide for details on dual-repo setups.
:::

::: caution Destructive Action
Executing this command permanently discards unstaged local modifications.
:::

::: details Click to expand build logs
Build logs output:
- Synchronized content
- Static HTML generated
:::
```

## Container Types

| Type | Semantic | Visual Style |
| --- | --- | --- |
| `tip` | Tips & Suggestions | Accent container with tip icon |
| `info` | Additional Context | Primary surface with info icon |
| `warning` | Warnings & Cautions | Warning tonal surface with alert icon |
| `caution` | Critical Danger | Error tonal surface with high contrast |
| `important` | Key Takeaways | Expressive highlighted container |
| `note` | General Notes | Neutral surface container |
| `details` | Collapsible Box | Native disclosure `<details>` element |
