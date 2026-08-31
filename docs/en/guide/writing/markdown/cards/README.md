---
title: Cards & Fields
createTime: 2026/08/31 23:11:00
permalink: /en/guide/writing/markdown/cards/
---

Shirone provides versatile card components including GitHub repository cards, API parameter field cards, and accordion panels.

## GitHub Repository Cards

Embed live repository metrics (title, bio, stars, and language) using the `::github` leaf directive:

```markdown
::github{repo="LyraVoid/Shirone"}
::github{repo="LyraVoid/Shirone-Content"}
```

## API Field Group Cards

Document APIs, props, or configuration parameters with `field-group` and `field` containers:

```markdown
:::: field-group

::: field title
@type string
@required

Main site title displayed on navbar and browser tab.
:::

::: field subtitle
@type string
@optional

Site subtitle for metadata and homepage display.
:::

::::
```

## Collapse Accordion Panels

```markdown
::: collapse accordion
- :+ Expanded by default

  Contents of the first card panel.

- Collapsed by default

  Contents of the second card panel.
:::
```
