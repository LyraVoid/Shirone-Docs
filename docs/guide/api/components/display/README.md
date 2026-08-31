---
title: 展示与反馈原子 (Display & Feedback Atoms)
createTime: 2026/09/01 01:40:00
permalink: /guide/api/components/display/
---

展示与反馈原子负责承载内容容器结构、视觉修饰、状态徽标、占位骨架屏与异步加载反馈。

---

## Card

**文件**：`src/components/atoms/display/Card.svelte`  
**职责**：官方 M3E 卡片容器原子，提供三种视觉变体，根据传入属性智能渲染为链接卡片（`<a>`）、可点击操作卡片（`<button>`）或普通静态容器（`<div>`）。

### Props 规范

```ts
interface CardProps {
  /** 变体：filled（默认，surface-container-highest 底色）/ elevated（Level 1 阴影）/ outlined（边框线） */
  variant?: "filled" | "elevated" | "outlined";
  /** 传入时渲染为原生 <a> 卡片链接；具有最高优先级 */
  href?: string;
  /** 链接 target（仅 href 时生效） */
  target?: string | null;
  /** 点击回调；传入且无 href 时渲染为原生 <button> 交互卡片 */
  onClick?: (e: MouseEvent) => void;
  /** 交互卡片是否可用（false 时触发禁用视觉降级与指针阻断） */
  enabled?: boolean;
  /** 覆盖容器背景色 */
  color?: string;
  /** 圆角覆盖（token 名 "m" | "l" | "xl" | "full" 或 CSS 长度） */
  radius?: string;
  /** 根元素 ID（供锚点或选择器引用） */
  id?: string;
  class?: string;
  children?: import("svelte").Snippet;
}
```

---

## Avatar

**文件**：`src/components/atoms/display/Avatar.svelte`  
**职责**：博主与用户头像原子，支持图片懒加载、加载失败文字占位降级与动态光效圈。

### Props 规范

```ts
interface AvatarProps {
  /** 头像图片 URL */
  src?: string;
  /** 图片替代文本（A11y） */
  alt?: string;
  /** 尺寸（像素或 CSS 字符串，如 48 或 "3rem"） */
  size?: number | string;
  /** 失败回退文字（如博主昵称首字母） */
  fallbackText?: string;
  /** 是否启用外圈动态色辉光 */
  glow?: boolean;
}
```

---

## Icon & MetaIcon

**文件**：`src/components/atoms/display/Icon.svelte` & `MetaIcon.astro`  
**职责**：
- `Icon.svelte`：离线图标渲染器，严禁运行时向外部 API 发起网络请求，所有图标数据打包编译入站。
- `MetaIcon.astro`：服务端静态直出图标（零客户端 JS 负担）。

---

## Badge & BadgedBox

**文件**：`src/components/atoms/display/Badge.svelte` & `BadgedBox.svelte`  
**职责**：状态角标与附着徽标，用于展示未读消息数、标签统计计数或置顶提示。

### Props 规范

```ts
interface BadgeProps {
  /** 徽标数值或文本 */
  value?: string | number;
  /** 最大展示数值（超出展示如 "99+"） */
  max?: number;
  /** 变体：primary / error / secondary */
  variant?: "primary" | "error" | "secondary";
  /** 小红点模式（不展示文字） */
  dot?: boolean;
}
```

---

## Skeleton

**文件**：`src/components/atoms/display/Skeleton.svelte`  
**职责**：内容加载骨架屏占位，内置 Material 3 柔和闪烁动效（Shimmer），有效降低用户等待感知。

### Props 规范

```ts
interface SkeletonProps {
  /** 形状类型：text（文本行）/ rect（矩形卡片）/ circle（圆形头像） */
  variant?: "text" | "rect" | "circle";
  width?: string;
  height?: string;
  /** 文本行数（variant="text" 时生效） */
  lines?: number;
  class?: string;
}
```

---

## LoadingIndicator

**文件**：`src/components/atoms/feedback/LoadingIndicator.svelte`  
**职责**：Material 3 异形变形加载指示器，基于 `loadingShapes.ts` 贝塞尔平滑插值算法在星形、方形、圆形之间平滑形变过渡。

### Props 规范

```ts
interface LoadingIndicatorProps {
  /** 尺寸：small (24px) / medium (48px) / large (72px) */
  size?: "small" | "medium" | "large";
  /** 颜色：primary（默认）/ on-surface */
  color?: "primary" | "on-surface";
  /** 提示文案 */
  label?: string;
}
```

---

## ProgressIndicator

**文件**：`src/components/atoms/feedback/ProgressIndicator.svelte`  
**职责**：线性（Linear）与环形（Circular）进度条，支持确定性数值（0~100）与无限循环加载（Indeterminate）模式。
