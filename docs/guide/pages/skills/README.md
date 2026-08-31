---
title: 技能页
createTime: 2026/09/01 00:26:00
permalink: /guide/pages/skills/
---

技能页（`/skills/`）以雷达图/卡片形式展示你的技术栈与熟练度。行为由 `skillsConfig.ts` 控制，条目数据在 `src/data/skills.ts` 维护。

## 行为配置

```ts title="src/config/skillsConfig.ts"
export const skillsConfig = withUserConfig("skills", {
  enable: true,        // 总开关：false 时导航入口隐藏，访问 /skills/ 跳转 404
  categories: [        // 筛选分类，数组顺序 = 页面顶部 Chips 顺序
    { key: "frontend", label: "Frontend", icon: "material-symbols:web-rounded" },
    { key: "backend", label: "Backend", icon: "material-symbols:dns-rounded" },
    { key: "tooling", label: "Tooling", icon: "material-symbols:construction-rounded" },
  ],
  // disabledNames: [], // 可选：被禁用的技能名称列表
})
```

| 字段 | 说明 |
| --- | --- |
| `enable` | 页面总开关 |
| `categories` | 筛选分类清单；条目通过 `category` 引用 `key` |
| `disabledNames` | 按技能名称停用单个条目（注意：与其他页按 key/ID 不同，这里按名称命中） |

## 数据字段

```ts title="src/data/skills.ts"
export const skillsData: SkillItem[] = [
  {
    name: "TypeScript",                    // 技能名称（唯一，禁用按它命中）
    description: "Typed application code…", // 一句话描述
    icon: "simple-icons:typescript",        // iconify 图标
    category: "frontend",                   // 分类，引用 config 中的 key
    level: "expert",                        // 熟练度
  },
]
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | 技能名称，需唯一（`disabledNames` 按它命中） |
| `description` | 否 | 一句话描述 |
| `icon` | 否 | iconify 图标（`simple-icons:*` 有海量品牌/语言图标） |
| `category` | 是 | 引用 config 分类 key |
| `level` | 是 | 熟练度等级 |

## 熟练度等级

`level` 描述你的掌握程度，常用取值：

| level | 含义 |
| --- | --- |
| `expert` | 精通，可作为主力技术 |
| `advanced` | 熟练，日常开发无障碍 |
| `intermediate` | 中等，能完成常见任务 |
| `beginner` | 入门，学习中 |

页面按等级渲染可视化展示（进度/星级样式），取值建议从上述四档中选，保持全站一致。

## 实战示例

**新增一个技能**

```ts title="src/data/skills.ts"
{
  name: "Rust",
  description: "系统编程与高性能工具链。",
  icon: "simple-icons:rust",
  category: "backend",
  level: "intermediate",
}
```

**隐藏某个技能**

```ts title="src/config/skillsConfig.ts"
disabledNames: ["PHP"],
```

::: warning 按名称命中
技能页的禁用字段是 `disabledNames`（按名称），与项目页的 `disabledKeys`（按 key）不同——名称必须与数据条目的 `name` 完全一致（大小写敏感）。
:::

**新增「设计」分类**

```ts title="src/config/skillsConfig.ts"
categories: [
  { key: "frontend", label: "Frontend", icon: "material-symbols:web-rounded" },
  { key: "backend", label: "Backend", icon: "material-symbols:dns-rounded" },
  { key: "design", label: "Design", icon: "material-symbols:brush-rounded" },
]
```

## 常见问题

**技能不显示**

三层检查：页面 `enable` → `category` 是否引用了 `categories` 中已有的 key → `name` 是否被 `disabledNames` 命中。

**重复名称的技能怎么办**

`disabledNames` 按名称命中会同时影响同名条目。技能名称应保持唯一；确需区分时在名称中加入后缀（如 `Node.js (Backend)`）。

**图标哪里找**

编程语言/框架图标优先用 `simple-icons:*` 集合（内置已装），完整清单见 [icones.js.org](https://icones.js.org/)。
