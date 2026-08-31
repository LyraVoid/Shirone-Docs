---
title: 横幅与背景
createTime: 2026/08/31 22:32:00
permalink: /guide/layout/banner/
---

横幅（Banner）是首页顶部的视觉焦点。Shirone 的横幅系统支持多图轮播、运镜动画、打字机副标题与底部波浪；背景层则提供「壁纸横幅 / 纯色」两种模式与 5 种纹理预设。

## 配置速览

```ts title="src/config/siteConfig.ts"
wallpaperMode: { defaultMode: "banner" },  // "banner" 壁纸 | "none" 纯色
texture: {
  enable: true,
  defaultPreset: "starlight",
  defaultOpacity: 0.12,
  allowMotion: true,
},
banner: {
  src: { desktop: [...], mobile: [...] },
  position: "center",
  dim: { enable: true, opacity: 0.24 },
  homeText: { ... },
  carousel: { ... },
  waves: { enable: true },
},
```

## 横幅图片（src）

```ts
src: {
  desktop: ["assets/images/banner/desktop/1.webp"],  // ≥ 1024px 使用
  mobile: ["assets/images/banner/mobile/1.webp"],    // < 1024px 的首页使用
},
```

- **desktop** 用于 1024px 及以上视口；**mobile** 仅用于 1024px 以下视口的首页（手机端非首页不显示壁纸，沿用紧凑布局）
- 数组顺序即轮播顺序；只想要静态横幅时，每组保留一张图片即可

> [!TIP]
> **图片路径规范**
> 推荐将图片放入 `src/assets` 并填写相对 `src` 的路径，这样构建期会自动生成 AVIF/WebP 响应式候选。以 `/` 开头的 `public` 路径与远程 URL 仍可用，但保留原图、不生成候选。

### 裁切焦点（position）

```ts
position: "center",  // "top" | "center" | "bottom"
```

同一张图在不同视口高度下按此焦点裁切。

### 遮罩（dim）

```ts
dim: {
  enable: true,   // 在图片上覆盖黑色遮罩，提高标题与顶栏对比度
  opacity: 0.24,  // 0-1
},
```

壁纸较亮时适当调高，保证白色文字可读。

## 首页文字（homeText）

```ts
homeText: {
  enable: true,          // 仅首页 Banner 显示，标题与副标题上下居中
  title: "Shirone",      // 横幅中央大字标题
  subtitle: [
    "特別なことはないけど、君がいると十分です",
    "今でもあなたは私の光",
    // ... 多条副标题随机/轮换展示
  ],
  typewriter: {
    enable: true,     // 副标题逐字打字机效果
    speed: 100,       // 打字速度（每字符间隔 ms）
    deleteSpeed: 50,  // 回退删除速度（每字符间隔 ms）
    pauseTime: 2000,  // 打字完成后停顿时间 ms
    loop: true,       // 完成后是否循环
  },
},
```

关闭 `typewriter.enable` 时直接显示完整副标题。

## 轮播（carousel）

```ts
carousel: {
  enable: true,         // 多张图片时生效；单张自动降级为静态展示
  interval: 6000,       // 切换间隔 ms（运行时最小 3000ms）
  fadeDuration: 1200,   // 交叉淡入淡出时长 ms
  animation: "ken-burns", // 运镜模式
},
```

| animation | 效果 |
| --- | --- |
| `ken-burns` | 默认，循环运镜呼吸 |
| `zoom-in` | 推进 |
| `zoom-out` | 拉远 |
| `pan-left` | 左移 |
| `pan-right` | 右移 |
| `none` | 无运镜 |

## 波浪（waves）

```ts
waves: { enable: true },
```

在 Banner 底部渲染页面背景色的水波纹，实现横幅与内容区的柔和过渡。关闭后不输出波浪 DOM。

## 背景模式与纹理

### 壁纸 vs 纯色（wallpaperMode）

```ts
wallpaperMode: { defaultMode: "banner" },
```

- `"banner"`：页面背景使用壁纸横幅
- `"none"`：页面背景使用主题纯色

访客可在显示设置中切换（`displaySettings.wallpaperMode: true` 时），其选择保存在浏览器并覆盖此处默认值。

### 纹理系统（texture）

```ts
texture: {
  enable: true,              // 总开关
  defaultPreset: "starlight", // 默认预设
  defaultOpacity: 0.12,       // 浓度 0.05 ~ 0.25
  allowMotion: true,          // 背景微动效（开启 reduced-motion 时自动静止）
},
```

| 预设 | 风格 |
| --- | --- |
| `none` | 无纹理 |
| `starlight` | 星光（默认） |
| `cyber-dots` | 赛博圆点 |
| `topography` | 等高线 |
| `geometric` | 几何 |
| `sakura` | 樱花 |

纹理颜色基于 HCT 动态取色，自动跟随主题配色。零开销设计：`enable: false` 或 `defaultPreset: "none"` 且面板未允许切换时，完全关闭——零 DOM、零 CSS、零运行时代价。

## 实战示例

**静态横幅 + 无动效（性能优先）**

```ts title="src/config/siteConfig.ts"
banner: {
  src: {
    desktop: ["assets/images/banner/desktop/1.webp"],
    mobile: ["assets/images/banner/mobile/1.webp"],
  },
  homeText: {
    enable: true,
    title: "我的博客",
    subtitle: ["静静写字，慢慢生活"],
    typewriter: { enable: false, speed: 100, deleteSpeed: 50, pauseTime: 2000, loop: false },
  },
  carousel: { enable: false, interval: 6000, fadeDuration: 1200, animation: "none" },
  waves: { enable: true },
},
```

**沉浸式轮播展示型主页**

```ts title="src/config/siteConfig.ts"
banner: {
  src: {
    desktop: [
      "assets/images/banner/desktop/1.webp",
      "assets/images/banner/desktop/2.webp",
      "assets/images/banner/desktop/3.webp",
    ],
    mobile: ["assets/images/banner/mobile/1.webp"],
  },
  homeText: {
    enable: true,
    title: "Shirone",
    subtitle: ["第一句", "第二句", "第三句"],
    typewriter: { enable: true, speed: 80, deleteSpeed: 40, pauseTime: 3000, loop: true },
  },
  carousel: { enable: true, interval: 5000, fadeDuration: 1200, animation: "ken-burns" },
  waves: { enable: true },
},
```

## 常见问题

::: collapse
- 横幅图片不显示

  依次检查：路径是否正确（`src/assets` 用相对路径、`public` 与远程 URL 以 `/` 或 `http` 开头）、文件是否存在、`wallpaperMode.defaultMode` 是否被设为 `"none"`、访客侧是否在显示设置中选了纯色模式。

- 手机上非首页没有横幅

  这是设计行为：移动端非首页使用紧凑布局并隐藏 Banner，只有首页显示 mobile 壁纸。

- 轮播间隔设置低于 3000ms 不生效

  运行时强制最小间隔 3000ms，防止切换过快闪烁。

- 纹理太淡/太浓看不清

  调整 `defaultOpacity`（有效范围 0.05 ~ 0.25）。纹理是点缀层，建议保持默认 0.12 附近，过高会干扰正文阅读。
:::
