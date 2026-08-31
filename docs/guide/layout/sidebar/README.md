---
title: 侧栏布局
createTime: 2026/08/31 22:34:00
permalink: /guide/layout/sidebar/
---

侧栏是数据驱动编排的：`sidebarConfig.ts` 决定单栏还是双栏、主栏在左还是右、以及 8 种 widget 的顺序、吸顶与页面过滤。本篇讲布局编排；各 widget 组件的深入配置见各自的配置文件（如音乐、公告）。

## 核心概念

```ts title="src/config/sidebarConfig.ts"
export const sidebarConfig = withUserConfig("sidebar", {
  enable: true,
  arrangement: "dual", // "single" 单栏（默认） | "dual" 双栏
  side: "left",        // "left" | "right" 主栏物理位置
  components: [ /* widget 清单 */ ],
})
```

| 字段 | 可选值 | 说明 |
| --- | --- | --- |
| `enable` | `boolean` | 侧栏总开关 |
| `arrangement` | `"single"` / `"dual"` | 单栏（默认）/ 双栏编排 |
| `side` | `"left"` / `"right"` | 主栏物理侧；dual 模式下副栏自动落对面 |

## 单栏与双栏（arrangement）

| 模式 | 行为 | 页框宽度 |
| --- | --- | --- |
| `"single"`（默认） | 全部 widget 渲染进唯一侧栏 | 85rem |
| `"dual"` | `column: "secondary"` 的 widget 进入副栏（视口 ≥ 1280px 展开三列） | 96rem |

dual 模式的响应式退化是自动的：1024px ~ 1279px 之间优雅退化为单栏（只显主栏），1280px 以下无需任何手动适配。TOC 悬浮 rail 在 dual 模式下自动让位（右侧余量被副栏占据）。

::: info 页框宽度不可手动覆盖
页框宽度由 `resolvePageWidth()` 按编排自动解析（常量 `PAGE_WIDTH` / `PAGE_WIDTH_DUAL`），不提供手动覆盖配置。
:::

## Widget 清单（components）

8 种组件类型：

| type | 组件 | 补充配置来源 |
| --- | --- | --- |
| `profile` | 博主资料卡 | `profileConfig.ts` |
| `music` | 音乐播放器 | `musicConfig.ts` + `src/data/music.ts` |
| `announcement` | 公告 | `announcementConfig.ts` |
| `categories` | 分类 | 文章内容自动聚合 |
| `tags` | 标签云 | 文章内容自动聚合 |
| `stats` | 站点统计 | 自动统计 |
| `calendar` | 日历 | 自动生成 |
| `toc` | 文章目录 | `siteConfig.toc` |

每个条目的通用属性：

```ts
{
  type: "categories",
  enable: true,            // 是否启用
  slot: "sticky",          // "top"（固定顶部）| "sticky"（滚动吸顶）
  column: "primary",       // "primary"（主栏，默认）| "secondary"（副栏，仅 dual 生效）
  pages: ["home", "post"], // 仅在指定页面展示，省略时全页面展示
  collapseAfter: 5,        // 折叠阈值（适用于 categories/tags，超出条数显示展开按钮）
}
```

### slot：固定 vs 吸顶

- `"top"`：固定在侧栏顶部，不随内容滚动
- `"sticky"`：页面滚动时吸顶跟随（适合分类、标签、TOC 这类长列表）

### pages：页面过滤

可用的页面标识：`home`、`archive`、`friends`、`moments`、`anime`、`compass`、`skills`、`projects`、`devices`、`timeline`、`albums`、`about`、`post`、`categories`、`tags`。

例如默认配置中 `announcement` 仅在首页展示（`pages: ["home"]`），`toc` 仅在文章页（`pages: ["post"]`）。

## 默认编排解读

主题默认的 dual 双栏编排：

```ts title="src/config/sidebarConfig.ts"
components: [
  { type: "profile", enable: true, slot: "top" },
  { type: "music", enable: true, slot: "top" },
  { type: "announcement", enable: true, slot: "top", pages: ["home"] },
  { type: "categories", enable: true, slot: "sticky", collapseAfter: 5,
    pages: [/* 列表页 + 文章页 */] },
  { type: "tags", enable: true, slot: "sticky", collapseAfter: 6,
    pages: [/* 列表页 + 文章页 */] },
  { type: "stats", enable: true, slot: "top", column: "secondary",
    pages: ["home", "archive", "categories", "tags"] },
  { type: "calendar", enable: true, slot: "top", column: "secondary" },
  { type: "toc", enable: true, slot: "sticky", column: "secondary", pages: ["post"] },
]
```

结构：主栏（左）承载资料、音乐、公告与吸顶的分类/标签；副栏（右）承载统计、日历与文章页 TOC。

注意：音乐 widget 的 `enable: true` 只是三重条件之一——还需 `musicConfig.enable` 为 `true` 且数据源有曲目，播放器才会加载（详见零额外负担契约）。

## 实战示例

**单栏极简侧栏（只留资料与目录）**

```ts title="src/config/sidebarConfig.ts"
{
  enable: true,
  arrangement: "single",
  side: "left",
  components: [
    { type: "profile", enable: true, slot: "top" },
    { type: "announcement", enable: true, slot: "top", pages: ["home"] },
    { type: "toc", enable: true, slot: "sticky", pages: ["post"] },
  ],
}
```

**右置主栏 + 双栏内容站**

```ts title="src/config/sidebarConfig.ts"
{
  enable: true,
  arrangement: "dual",
  side: "right",   // 主栏在右，副栏落左
  components: [
    { type: "profile", enable: true, slot: "top" },
    { type: "stats", enable: true, slot: "top", column: "secondary" },
    { type: "calendar", enable: true, slot: "top", column: "secondary" },
    { type: "categories", enable: true, slot: "sticky", collapseAfter: 5 },
    { type: "tags", enable: true, slot: "sticky", collapseAfter: 6 },
    { type: "toc", enable: true, slot: "sticky", column: "secondary", pages: ["post"] },
  ],
}
```

## 常见问题

::: collapse
- widget 顺序怎么定
  `components` 数组顺序即渲染顺序（各栏内部按声明顺序排列）。调整顺序直接移动数组元素。

- secondary 条目在 single 模式下会怎样
  `column: "secondary"` 仅在 `arrangement: "dual"` 时生效，single 模式下该条目自动落回主栏，不会丢失。

- 分类/标签列表太长
  用 `collapseAfter` 折叠阈值：超过 N 条时折叠并显示展开按钮。默认分类 5 条、标签 6 条。

- 侧栏完全不显示
  检查三层：`sidebarConfig.enable` 总开关、当前页面是否在 widget 的 `pages` 白名单内、视口宽度（移动端侧栏收进抽屉，不并排显示）。

- Swup 切页后侧栏 widget 状态会不会丢
  不会。侧栏属于 Swup 的持久外围框架，切页时不重建——音乐播放进度、折叠状态等在站内导航全程保持。页面过滤的显隐通过 `data-current-page` 联动。
:::
