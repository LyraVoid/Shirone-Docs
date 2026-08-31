---
title: 动态配色
createTime: 2026/08/31 22:31:00
permalink: /guide/layout/theme-color/
---

动态配色是 Shirone 的核心特性：基于 Google 的 ==HCT 色彩空间== 与 Material Color Utilities，从一个种子色（hue）派生出 ==8 大调色板与 25 种以上颜色角色==，全站组件（按钮、卡片、代码块、横幅波浪等）统一消费这套角色令牌。

## 配置速览

```ts title="src/config/siteConfig.ts"
themeColor: {
  hue: 315,           // 默认色相 0-360
  fixed: false,       // 是否对访客隐藏主题色选择器
  style: "tonalSpot", // 调色板风格
  spec: "2025",       // 设计规范版本
},
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `hue` | `number` | `315` | 种子色相，0-360 全色环取值 |
| `fixed` | `boolean` | `false` | `true` 时隐藏访客的配色风格选择器，锁定站点配色 |
| `style` | `string` | `"tonalSpot"` | Material 调色板派生风格，共 9 种 |
| `spec` | `string` | `"2025"` | `"2021"`（MD3）/ `"2025"`（M3 Expressive） |

## 色相（hue）

`hue` 是整个配色系统的种子。Shirone 默认 `315`（粉紫，偏二次元气质），源码注释推荐的三档：

| hue | 色感 |
| --- | --- |
| `315` | 粉紫（默认，二次元） |
| `262` | 紫 |
| `345` | 粉 |

取值范围 0-360 对应完整色环：`0` 红、`120` 绿、`210` 青、`270` 紫。修改后无需任何其他改动——所有颜色角色自动跟随重派生。

> [!TIP]
> **与壁纸联动**
> 开启横幅壁纸模式时，主题还能从横幅壁纸中实时提取主题色，访客侧的配色会随壁纸微调。种子 `hue` 始终是访客未做选择时的基准。

## 调色板风格（style）

`style` 决定从种子色派生调色板的算法，取值来自 Material Color Utilities：

| style | 特点 |
| --- | --- |
| `tonalSpot` | 默认。色调柔和、明度层次均衡，最稳妥的选择 |
| `vibrant` | 高饱和、鲜艳活泼 |
| `content` | 从内容色派生，对比度导向 |
| `expressive` | 表现力强，色相跨度大（M3 Expressive 推荐） |
| `rainbow` | 彩虹式广色相派生 |
| `fruitSalad` | 水果沙拉式混合色相 |
| `monochrome` | 单色系，极简灰调 |
| `neutral` | 中性色，接近无彩 |
| `fidelity` | 忠实还原种子色 |

## 设计规范版本（spec）

| spec | 规范 | 差异 |
| --- | --- | --- |
| `"2021"` | Material Design 3 | 经典 MD3 派生 |
| `"2025"` | Material 3 Expressive | 默认。角色集与 2021 一致，差异仅在调色板派生算法 |

主题整体按 M3 Expressive 设计（大圆角、 expressive 组件），建议保持默认 `"2025"`。

## 显示设置面板（displaySettings）

访客通过站点的「显示设置」浮层实时切换配色，`displaySettings` 控制各切换项是否展示：

```ts title="src/config/siteConfig.ts"
displaySettings: {
  colorStyle: true,   // 配色风格 9 宫格
  colorSpec: true,    // Color Spec 调色规范切换（2021/2025）
  wallpaperMode: true, // 页面背景（纯色/横幅）切换
  layoutMode: true,   // 文章列表布局（列表/网格）切换
  reduceMotion: true, // 减少动效切换
  texture: true,      // 背景纹理选择
},
```

访客的选择保存在浏览器本地，并覆盖站点默认值。全部设为 `false` 即可得到一个完全固定外观的站点。

配合 `themeColor.fixed: true`，可以彻底锁死配色——访客只能看到你设定的样子。

## 实战示例

**极简灰调站点（锁定配色）**

```ts title="src/config/siteConfig.ts"
themeColor: {
  hue: 210,
  fixed: true,
  style: "monochrome",
  spec: "2025",
},
displaySettings: {
  colorStyle: false,
  colorSpec: false,
  wallpaperMode: false,
  layoutMode: true,
  reduceMotion: true,
  texture: false,
},
```

**鲜活二次元风（默认推荐）**

```ts title="src/config/siteConfig.ts"
themeColor: {
  hue: 345,
  fixed: false,
  style: "vibrant",
  spec: "2025",
},
```

访客可自由切换 9 种风格与调色规范。

## 常见问题

::: collapse
- 改了 hue 但颜色没变

  浏览器缓存了访客侧的显示设置选择。清除站点本地存储（LocalStorage）或使用无痕窗口验证。

- fixed 和 displaySettings.colorStyle 是什么关系

  `fixed: true` 隐藏的是配色风格选择器本身（等同于强制 `colorStyle: false` 且锁定当前 style）；`displaySettings.colorStyle: false` 只是隐藏面板项，当前风格仍然生效。两者同时设置最彻底。

- spec 设为 2021 会有问题吗

  不会，角色集一致，仅派生算法不同。可以都试一下，保留你喜欢的观感。

- 深色模式怎么配

  深色模式由同一套 HCT 角色自动派生（同一 hue 在暗色下生成另一组角色），无需单独配置。访客可在显示设置中切换明暗，主题也会跟随系统偏好。
:::
