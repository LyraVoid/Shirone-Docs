---
title: 卡片与字段组
createTime: 2026/08/31 23:11:00
permalink: /guide/writing/markdown/cards/
---

Shirone 提供了丰富的卡片系统，包括 GitHub 仓库卡片、API 字段参数卡片组以及折叠卡片组。

## GitHub 仓库卡片

使用 `::github` 指令自动拉取并展示 GitHub 仓库信息（含名称、简介、Star 数与主语言）：

```markdown
::github{repo="LyraVoid/Shirone"}
::github{repo="LyraVoid/Shirone-Content"}
```

## API 字段参数卡片组

在编写技术文档、API 说明或配置项手册时，使用 `field-group` 与 `field` 容器生成结构化的参数卡片：

```markdown
:::: field-group

::: field title
@type string
@required

网站正式标题，显示在顶栏和浏览器标签页。
:::

::: field subtitle
@type string
@optional

网站副标题，用于元数据与首页辅助展示。
:::

::::
```

## 折叠面板卡片

```markdown
::: collapse accordion
- :+ 默认展开的项目

  这里是第一个卡片的内容正文。

- 默认折叠的项目

  这里是第二个卡片的内容正文。
:::
```
