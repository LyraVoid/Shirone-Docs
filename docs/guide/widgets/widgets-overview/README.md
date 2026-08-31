---
title: 组件总览
createTime: 2026/09/01 00:40:00
permalink: /guide/widgets/widgets-overview/
---

侧栏由 8 种 widget（挂件组件）组成，通过 `sidebarConfig.ts` 的 `components` 数组编排。本篇是组件的契约总览——每个组件「数据从哪来、怎么渲染、默认在哪显示」；编排方式（slot/column/pages）见[侧栏布局](/guide/layout/sidebar/)。

## 组件契约总览

| type | 组件 | 数据源 | 默认 slot | 呈现与职责 |
| --- | --- | --- | --- | --- |
| `profile` | 博主资料卡 | `profileConfig.ts` | `top` | 头像、名称、简介、社交链接 |
| `music` | 音乐播放器 | `musicConfig.ts` / `data/music.ts` / Meting | `top` | M3 卡片播放器，持久侧栏内切页不断播 |
| `announcement` | 站点公告 | `announcementConfig.ts` | `top` | 纯卡片（无标题外壳），支持关闭与记忆 |
| `categories` | 分类列表 | 文章自动聚合（`getCategoryList()`） | `sticky` | 分类项列表，支持折叠 |
| `tags` | 标签列表 | 文章自动聚合（`getTagList()`） | `sticky` | 标签 Chip 列表，支持折叠 |
| `stats` | 站点统计 | 站点数据备忘化计算 | `top` | 总字数、文章数、运行天数等键值网格 |
| `calendar` | 月度文章历 | 文章日期聚合 | `top` | 日历视图（Svelte 水合岛） |
| `toc` | 当前文章目录 | 当前页 Markdown 标题 | `sticky` | 平滑高亮阅读位置，内容区独立滚动 |

## 编排回顾

每个组件条目支持以下通用属性（详细语义见[侧栏布局](/guide/layout/sidebar/)）：

```ts
{
  type: "announcement",
  enable: true,           // 单组件开关
  slot: "top",            // "top" 固定顶部 | "sticky" 滚动吸顶
  column: "primary",      // "primary" 主栏 | "secondary" 副栏（dual 模式）
  pages: ["home"],        // 页面范围过滤，省略 = 全页面
  collapseAfter: 5,       // 折叠阈值（categories/tags 专属）
}
```

## 默认编排

主题默认的 dual 双栏编排分配：

- **主栏**（左）：profile（top）→ music（top）→ announcement（top，仅首页）→ categories（sticky）→ tags（sticky）
- **副栏**（右）：stats（top，首页/归档/分类/标签）→ calendar（top）→ toc（sticky，仅文章页）

## 专属配置入口

| 组件 | 配置文件 | 专篇 |
| --- | --- | --- |
| profile | `profileConfig.ts` | [页脚与博主资料](/guide/layout/footer-profile/) |
| music | `musicConfig.ts` | [音乐播放器](/guide/widgets/music/) |
| announcement | `announcementConfig.ts` | [公告组件](/guide/widgets/announcement/) |
| toc | `siteConfig.toc`（深度/开关） | [基础配置](/guide/layout/site-config/) |
| categories / tags / stats / calendar | 无（自动聚合） | [基础组件](/guide/widgets/basic-widgets/) |

## 组件设计约定（主题内部契约）

了解这些约定有助于理解主题行为：

1. **零额外负担**：可选组件（音乐、公告）关闭或无内容时不输出 DOM、不发请求
2. **持久框架**：侧栏位于 Swup 容器外——切页不重建，音乐播放进度、折叠状态全程保持
3. **自动取数**：categories/tags/stats/calendar 的数据全部自动聚合自文章，无需手动维护
4. **移动端互补**：桌面端侧栏 TOC 在移动端自动由 FAB 悬浮目录接替（见[悬浮控制流](/guide/article/fab/)）

## 常见问题

::: collapse
- 某个 widget 想只在特定页面显示

  用 `pages` 过滤。页面标识清单见[独立页面总览](/guide/pages/pages-overview/)。

- 组件顺序想调整

  `components` 数组顺序即渲染顺序（各栏内部按声明顺序），直接重排。

- 侧栏整体不想要了

  `sidebarConfig.enable: false`；或单页面隐藏用每条目的 `pages` 白名单控制。
:::
