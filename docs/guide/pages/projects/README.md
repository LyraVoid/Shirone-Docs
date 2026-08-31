---
title: 项目页
createTime: 2026/09/01 00:25:00
permalink: /guide/pages/projects/
---

项目页（`/projects/`）展示你的开源项目与作品集。行为由 `projectsConfig.ts` 控制，条目数据在 `src/data/projects.ts` 维护。

## 行为配置

```ts title="src/config/projectsConfig.ts"
export const projectsConfig = withUserConfig("projects", {
  enable: true,        // 总开关：false 时导航入口隐藏，访问 /projects/ 跳转 404
  categories: [        // 筛选分类，数组顺序 = 页面顶部 Chips 顺序
    { key: "theme", label: "Theme", icon: "material-symbols:palette-outline-rounded" },
    { key: "android", label: "Android", icon: "material-symbols:android-rounded" },
  ],
  // disabledKeys: [], // 可选：被禁用的项目 key 列表
})
```

| 字段 | 说明 |
| --- | --- |
| `enable` | 页面总开关 |
| `categories` | 筛选分类清单；条目通过 `category` 字段引用这里的 `key` |
| `disabledKeys` | 按项目 `key` 停用单个条目（不渲染，数据保留） |

## 数据字段

```ts title="src/data/projects.ts"
export const projectsData: ProjectItem[] = [
  {
    key: "shirone",                    // 唯一标识（禁用列表按它命中）
    title: "Shirone",                  // 项目名
    summary: "An Astro blog theme…",   // 一句话简介
    category: "theme",                 // 分类，引用 config 中的 key
    phase: "building",                 // 状态："building" 构建中 | "shipped" 已发布
    technologies: ["Astro", "Svelte"], // 技术栈标签
    icon: "material-symbols:…",        // iconify 图标
    cover: "/assets/projects/shirone.webp",  // 封面（可选）
    coverAlt: "封面替代文本",           // 无障碍描述（可选）
    featured: true,                    // 是否精选展示
    repository: "https://github.com/…", // 仓库链接（可选）
    year: "2026",                      // 年份（可选）
  },
]
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `key` | 是 | 唯一标识，`disabledKeys` 按它命中 |
| `title` / `summary` | 是 | 名称与简介 |
| `category` | 是 | 引用 config 分类 key |
| `phase` | 是 | `"building"`（构建中）或 `"shipped"`（已发布） |
| `technologies` | 否 | 技术栈标签列表 |
| `icon` / `cover` / `coverAlt` | 否 | 图标、封面图、封面替代文本 |
| `featured` | 否 | `true` 时精选展示 |
| `repository` / `year` | 否 | 仓库链接、年份 |

## 实战示例

**新增一个项目**

```ts title="src/data/projects.ts"
{
  key: "my-tool",
  title: "MyTool",
  summary: "一个提升开发效率的命令行工具。",
  category: "theme",           // 须是 categories 中已有的 key
  phase: "building",
  technologies: ["Node.js", "TypeScript"],
  icon: "simple-icons:nodedotjs",
  repository: "https://github.com/you/my-tool",
}
```

**隐藏某个项目但保留数据**

```ts title="src/config/projectsConfig.ts"
disabledKeys: ["folkpatch"],
```

**新增分类**

```ts title="src/config/projectsConfig.ts"
categories: [
  { key: "theme", label: "Theme", icon: "material-symbols:palette-outline-rounded" },
  { key: "android", label: "Android", icon: "material-symbols:android-rounded" },
  { key: "tooling", label: "Tooling", icon: "material-symbols:construction-rounded" },
]
```

## 常见问题

::: collapse
- 新项目不显示
  三层检查：页面 `enable` → `category` 是否引用了 `categories` 中已有的 key → `key` 是否被 `disabledKeys` 命中。

- 封面图放哪里
  `cover` 支持相对 `public` 的绝对路径（`/assets/projects/xxx.webp`）等写法，路径规则同文章图片（见[图片画廊与文件组织](/guide/writing/gallery/)）。

- phase 有哪些取值
  `"building"`（构建中）与 `"shipped"`（已发布），页面用不同样式区分。
:::
