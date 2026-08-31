---
title: 基础组件
createTime: 2026/09/01 00:43:00
permalink: /guide/widgets/basic-widgets/
---

六个数据自动聚合、无需专属配置文件的组件：分类、标签、站点统计、日历、目录、资料卡。它们的「配置」只有编排属性（开关、位置、页面过滤、折叠阈值）——放在 `sidebarConfig` 的条目里。

## 分类（categories）

- **数据源**：全站文章的 `category` 字段自动聚合（`getCategoryList()`），含各分类文章数
- **渲染**：分类项列表，点击进入分类页
- **专属属性**：`collapseAfter`——超出数量后折叠，显示展开按钮（默认 5）

```ts
{ type: "categories", enable: true, slot: "sticky", collapseAfter: 5 }
```

## 标签（tags）

- **数据源**：全站文章的 `tags` 自动聚合（`getTagList()`）
- **渲染**：标签 Chip 列表
- **专属属性**：`collapseAfter`（默认 6）

```ts
{ type: "tags", enable: true, slot: "sticky", collapseAfter: 6 }
```

## 站点统计（stats）

- **数据源**：站点数据备忘化计算（总字数、文章数、运行天数等）
- **渲染**：键值对网格
- **特点**：多页面共享的重计算已备忘化，重复渲染无额外开销

```ts
{ type: "stats", enable: true, slot: "top", column: "secondary",
  pages: ["home", "archive", "categories", "tags"] }
```

## 日历（calendar）

- **数据源**：文章日期聚合（按月统计发文）
- **渲染**：月历视图，有文章的日期高亮；Svelte 水合岛（`client:visible`——滚动进入视口才激活）
- **特点**：纯展示组件，无需任何配置

```ts
{ type: "calendar", enable: true, slot: "top", column: "secondary" }
```

## 文章目录（toc）

- **数据源**：当前文章的 Markdown 标题层级（由页面布局透传）
- **渲染**：目录列表，平滑高亮当前阅读位置（M3 tonal pill 状态）；内容区限高（`calc(100dvh - 15rem)`）独立滚动
- **页面范围**：默认 `pages: ["post"]` 仅文章页
- **移动端互补**：桌面端（≥1024px）显示本组件；移动端/平板自动由 FAB 悬浮目录接替（见[悬浮控制流](/guide/article/fab/)）
- **标题来源**：收录深度由 `siteConfig.toc.depth` 控制（见[基础配置](/guide/layout/site-config/)）

```ts
{ type: "toc", enable: true, slot: "sticky", column: "secondary", pages: ["post"] }
```

## 资料卡（profile）

- **数据源**：`profileConfig.ts`（头像/名称/简介/社交链接）
- **渲染**：头像 + 名称 + 简介 + 社交图标按钮（带 Tooltip）
- **位置**：通常主栏 `slot: "top"` 最顶部
- **配置详解**：见[页脚与博主资料](/guide/layout/footer-profile/)

```ts
{ type: "profile", enable: true, slot: "top" }
```

## 编排示例

**统计与日历放副栏（dual 模式）**

```ts title="src/config/sidebarConfig.ts"
{ type: "stats", enable: true, slot: "top", column: "secondary" },
{ type: "calendar", enable: true, slot: "top", column: "secondary" },
```

**目录提升到主栏（单栏模式）**

```ts title="src/config/sidebarConfig.ts"
{ enable: true, arrangement: "single", components: [
  { type: "profile", enable: true, slot: "top" },
  { type: "toc", enable: true, slot: "sticky", pages: ["post"] },
] }
```

## 常见问题

::: collapse
- 分类/标签列表是空的
  数据由文章聚合。发布至少一篇带 `category` / `tags` 的文章后才会出现内容。

- 统计的「运行天数」从哪天算
  从站点数据计算的备忘化指标（如建站日期），随文章与时间自动更新。

- 日历某月没高亮
  该月没有发布文章。日历只反映 `published` 日期分布。

- 移动端为什么看不到侧栏目录
  移动端侧栏收进抽屉，目录由 FAB 悬浮目录面板接替——这是设计好的互补机制，见[悬浮控制流](/guide/article/fab/)。
:::
