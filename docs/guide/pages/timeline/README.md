---
title: 时间线页
createTime: 2026/09/01 00:28:00
permalink: /guide/pages/timeline/
---

时间线页（`/timeline/`）以节点流展示你的经历与里程碑。行为由 `timelineConfig.ts` 控制，条目数据在 `src/data/timeline.ts` 维护。它是四个展示页中唯一带**排序配置**的页面。

## 行为配置

```ts title="src/config/timelineConfig.ts"
export const timelineConfig = withUserConfig("timeline", {
  enable: true,        // 总开关：false 时导航入口隐藏，访问 /timeline/ 跳转 404
  categories: [        // 筛选分类，数组顺序 = 页面顶部 Chips 顺序
    { key: "milestone", label: "Milestones", icon: "material-symbols:flag-rounded" },
    { key: "project", label: "Projects", icon: "material-symbols:code-rounded" },
    { key: "career", label: "Career", icon: "material-symbols:work-rounded" },
    { key: "education", label: "Education", icon: "material-symbols:school-rounded" },
    { key: "life", label: "Life", icon: "material-symbols:favorite-rounded" },
  ],
  order: "desc",       // 排序方向："desc" 倒序（默认）| "asc" 正序
  // disabledTitles: [], // 可选：被禁用的事件标题列表
})
```

| 字段 | 说明 |
| --- | --- |
| `enable` | 页面总开关 |
| `categories` | 筛选分类；默认五类（里程碑/项目/职业/教育/生活） |
| `order` | **本页独有**：`"desc"` 最新在前（默认）/ `"asc"` 最早在前 |
| `disabledTitles` | 按事件标题停用单个条目 |

## 数据字段

```ts title="src/data/timeline.ts"
export const timelineData: TimelineItem[] = [
  {
    title: "Shirone Theme Major Upgrade",   // 事件标题（禁用按它命中）
    date: "2026.08",                        // 时间（自由格式，如区间 "2025.03 – Present"）
    category: "milestone",                  // 分类，引用 config 中的 key
    subtitle: "Open Source Project",        // 副标题（可选）
    location: "Tokyo, Japan",               // 地点（可选）
    description: "重构了整个主题……",          // 经历描述
    highlights: [                           // 要点列表（可选）
      "Implemented dynamic HCT palette",
      "Added multi-page capabilities",
    ],
    tags: ["Astro", "Svelte 5"],            // 技术标签（可选）
    links: [                                // 关联链接（可选）
      { label: "GitHub", url: "https://github.com/…", icon: "fa6-brands:github" },
    ],
    icon: "material-symbols:rocket-launch-rounded",  // 节点图标
    featured: true,                         // 精选
  },
]
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 事件标题，`disabledTitles` 按它命中 |
| `date` | 是 | 时间文本，自由格式（区间、单点均可） |
| `category` | 是 | 引用 config 分类 key |
| `subtitle` / `location` | 否 | 副标题、地点 |
| `description` | 否 | 经历描述 |
| `highlights` | 否 | 要点列表（数组） |
| `tags` / `links` / `icon` / `featured` | 否 | 标签、关联链接、节点图标、精选 |

## 排序方向

时间线是四个展示页中唯一有 `order` 字段的：

```ts
order: "desc",  // 默认：时间倒序，最新在前——适合「最近做了什么」
order: "asc",   // 正序，最早在前——适合「从起点讲起」的成长故事
```

::: tip date 是自由文本
`date` 不要求机器可解析的格式——`"2025.03 – Present"`、`"2024 年夏"` 都合法，按你写的样式直接展示。但保持全站风格统一更美观。
:::

## 实战示例

**新增一段经历**

```ts title="src/data/timeline.ts"
{
  title: "独立开发者",
  date: "2026.01 – Present",
  category: "career",
  subtitle: "自由职业",
  description: "开始全职独立开发，维护开源项目与接手外包。",
  highlights: [
    "发布两款小工具",
    "建立稳定的订阅收入",
  ],
  tags: ["Indie", "Product"],
  icon: "material-symbols:rocket-launch-rounded",
}
```

**成长故事型时间线（正序）**

```ts title="src/config/timelineConfig.ts"
order: "asc",
```

**隐藏某段经历**

```ts title="src/config/timelineConfig.ts"
disabledTitles: ["某段不想展示的经历"],
```

## 常见问题

::: collapse
- 事件不显示

  三层检查：页面 `enable` → `category` 是否引用了 `categories` 中已有的 key → `title` 是否被 `disabledTitles` 命中。

- 顺序不对

  确认 `order` 取值；同一时间段的多个事件按数据数组顺序渲染，想微调顺序就重排数组。

- links 的图标不显示

  `icon` 是 iconify 编码，品牌图标用 `fa6-brands:*`（内置已装），其他集合需先安装。
:::
