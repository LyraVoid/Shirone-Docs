---
title: 游戏页
createTime: 2026/09/16 12:00:00
permalink: /guide/pages/games/
---

游戏页（`/games/`）展示你的游戏清单——横屏封面、评分、游玩时长与简评。行为由 `gamesConfig.ts` 控制，条目数据在 `src/data/games.ts` 维护。

## 行为配置

```ts title="src/config/gamesConfig.ts"
export const gamesConfig: GamesConfig = withUserConfig("games", {
  enable: true,        // 总开关：false 时导航入口隐藏，访问 /games/ 跳转 404
  categories: [        // 游戏分类，数组顺序 = 页面顶部 Chips 顺序
    {
      key: "open-world",
      label: "Open World",
      icon: "material-symbols:explore-outline-rounded",
      description: "Open-world adventures",
    },
    // …Sandbox / RPG / Action / Casual
  ],
  // disabledIds: [], // 可选：被禁用的游戏 ID 列表
})
```

| 字段 | 说明 |
| --- | --- |
| `enable` | 页面总开关 |
| `categories` | 分类清单（`key` / `label` / `icon` / `description`）；没有任何条目的分类会自动隐藏 |
| `disabledIds` | 按游戏 `id` 停用单个条目（兼容 `disabledKeys` 别名） |

页面自带实时搜索（按名称、开发商、平台、年份、简评与标签匹配）与分类筛选，筛选状态同步到 URL（`?category=` / `?q=`），刷新与分享后保留。

## 数据字段

```ts title="src/data/games.ts"
export const gamesData: GameItem[] = [
  {
    id: "minecraft",                // 唯一标识（禁用列表按它命中）
    name: "Minecraft",              // 游戏名称
    developer: "Mojang Studios",    // 开发商
    category: "sandbox",            // 分类，引用 config 中的 key
    status: "playing",              // 游玩状态
    cover: "assets/games/minecraft-hero.jpg", // 横屏封面（可省略）
    icon: "material-symbols:widgets-rounded", // 无封面时的图标
    rating: 5,                      // 评分（0–5，支持 0.5 步进）
    hours: 420,                     // 已游玩时长（小时）
    platform: "PC",                 // 平台
    year: "2011",                   // 发行年份
    tags: ["Sandbox", "Survival"],  // 类型标签（卡片上的 chips）
    description: "方块世界沙盒游戏……", // 简评
    link: "https://www.minecraft.net/", // 商店页/官网链接
    featured: true,                 // Featured 推荐徽章
  },
]
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 唯一标识，`disabledIds` 按它命中 |
| `name` / `developer` | 是 | 游戏名与开发商 |
| `category` | 是 | 引用 config 分类 key |
| `status` | 是 | `playing` / `completed` / `backlog` / `wishlist`，渲染为状态 pill |
| `description` | 是 | 游戏简评 |
| `cover` | 否 | 横屏封面（建议 16:9 或更宽）。支持 `src/assets` 相对路径（走构建期图片管线）、`/public` 绝对路径与远程 URL；省略时渲染图标卡片 |
| `icon` | 否 | 无封面时的 Iconify 图标 |
| `rating` / `hours` | 否 | 评分（0–5，0.5 步进）与游玩时长（小时） |
| `platform` / `year` | 否 | 平台与发行年份 |
| `tags` | 否 | 类型标签 chips |
| `link` / `featured` | 否 | 商店页链接与 Featured 徽章 |

与其他展示页的区别：游戏封面是**横屏**的（胶囊图），卡片以横向封面为主视觉，因此媒体字段是 `cover` 而非方图。

## 实战示例

**新增一款游戏**

```ts title="src/data/games.ts"
{
  id: "tears-of-the-kingdom",
  name: "The Legend of Zelda: Tears of the Kingdom",
  developer: "Nintendo",
  category: "open-world",
  status: "completed",
  rating: 5,
  hours: 180,
  platform: "Switch",
  year: "2023",
  tags: ["Open World", "Adventure"],
  description: "海拉鲁的创造玩法巅峰。",
  link: "https://www.zelda.com/tears-of-the-kingdom/",
}
```

**暂时封存一款游戏（保留数据）**

```ts title="src/config/gamesConfig.ts"
disabledIds: ["minecraft"],
```

**新增「模拟经营」分类**

```ts title="src/config/gamesConfig.ts"
categories: [
  // …既有分类,
  {
    key: "simulation",
    label: "Simulation",
    icon: "material-symbols:factory-outline-rounded",
    description: "Builders, tycoons & management sims",
  },
]
```

## 常见问题

::: collapse
- 游戏不显示

  三层检查：页面 `enable` → `category` 是否引用了 `categories` 中已有的 key → `id` 是否被 `disabledIds` 命中。分类下没有任何条目时整个分类 Chip 自动隐藏。

- 封面支持哪些写法

  三种：`src/assets` 相对路径（参与构建期压缩转码，推荐）、`/public` 绝对路径（原样输出）与远程 URL。横屏图（16:9 或更宽）效果最佳；不填 `cover` 时回退渲染 `icon` 图标卡片。

- status 有哪些取值

  `playing`（正在游玩）、`completed`（已通关）、`backlog`（积压待玩）、`wishlist`（愿望清单）。状态 pill 使用 M3 色调配对保证对比度达标。
:::
