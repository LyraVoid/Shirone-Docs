---
title: GitHub Alerts
createTime: 2026/08/31 23:10:00
permalink: /en/guide/writing/markdown/github-alerts/
---

Shirone natively supports GitHub-style blockquote alerts, rendering them directly into styled alert containers without special directives.

## Syntax

Start with blockquote `>` followed by the capitalized alert tag on the first line:

```markdown
> [!NOTE]
> General note containing background context.

> [!TIP]
> Helpful advice for workflow efficiency.

> [!IMPORTANT]
> Crucial information to verify before deploying.

> [!WARNING]
> Warnings regarding potential risks or compatibility.

> [!CAUTION]
> Critical warnings before performing destructive operations.
```

## Cross-Platform Consistency

- Markdown rendered on GitHub repository previews and inside Shirone blog posts maintain consistent layout and semantics.
- Translated into semantic AST nodes matching standard admonition containers.
