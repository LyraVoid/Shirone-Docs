---
title: 悬浮控制流（FAB）
createTime: 2026/09/01 00:11:00
permalink: /guide/article/fab/
---

FAB（Floating Action Button）是右下角的悬浮操作栏，聚合返回顶部、悬浮目录、直达评论、返回首页等操作。`fabConfig.ts` 控制它的开关、位置尺寸与按钮清单。

## 配置速览

```ts title="src/config/fabConfig.ts"
export const fabConfig = withUserConfig("fab", {
  enable: true,
  align: "end",       // "start" 靠左 | "end" 靠右（默认）
  size: "regular",    // "small" | "regular" | "large"
  offset: {
    bottom: "var(--m3e-space-8)",
    right: "var(--m3e-space-6)",
  },
  items: [ /* 按钮清单，按数组顺序渲染 */ ],
})
```

| 字段 | 可选值 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 悬浮操作栏总开关 |
| `align` | `"start"` / `"end"` | `"end"` | 水平位置：靠左 / 靠右 |
| `size` | `"small"` / `"regular"` / `"large"` | `"regular"` | 按钮尺寸档位 |
| `offset` | CSS 值 | 设计令牌 | 右下角边距，支持 CSS 变量或具体像素 |
| `items` | `array` | 四个按钮 | 操作按钮清单 |

## 按钮类型

| type | 功能 | 默认行为 |
| --- | --- | --- |
| `top` | 平滑返回顶部 | 滚过横幅高度阈值后平滑浮现 |
| `toc` | 悬浮文章目录面板 | 桌面端已有侧栏粘性 TOC，默认仅在 mobile/tablet 显示 |
| `comment` | 直达评论区 | 评论系统关闭或文章关闭评论时**零 DOM 产物** |
| `home` | 返回首页 | `onlySubPages: true` 仅在非首页展示 |

每个按钮条目的通用属性：

```ts
{
  type: "toc",
  enable: true,                        // 单按钮开关
  icon: "material-symbols:…",          // 自定义图标（可选）
  devices: ["mobile", "tablet"],       // 受控设备矩阵，省略 = 全设备
  pages: ["post"],                     // 页面范围过滤
}
```

### 设备矩阵（devices）

三个档位对应 `fabConfig` 注释中的断点：

- `"mobile"`：小于 768px
- `"tablet"`：768px ~ 1023px
- `"desktop"`：1024px 及以上

省略 `devices` 时全设备生效。SSR 阶段直接输出 Tailwind 响应式类（如 `flex lg:hidden`），**零首屏闪烁、CLS = 0**。

### 页面过滤（pages）

与侧栏的页面标识体系一致（如 `["post"]` 仅文章页显示）。Swup 站内导航时通过 `#swup-container` 的 `data-current-page` 联动显隐。

## 默认配置解读

```ts title="src/config/fabConfig.ts"
items: [
  { type: "top", enable: true, devices: ["mobile", "tablet", "desktop"] },
  { type: "toc", enable: true, devices: ["mobile", "tablet"], pages: ["post"],
    depth: 3, closeOnSelect: true },
  { type: "comment", enable: true, devices: ["mobile", "tablet"], pages: ["post"] },
  { type: "home", enable: true, devices: ["mobile", "tablet"], onlySubPages: true },
]
```

设计意图：`top` 全端可用；`toc`、`comment`、`home` 收敛到移动端与平板（桌面端的目录/评论已由侧栏与页面本体承担），`toc` 收录到 h3（`depth: 3`）、选中后自动收起（`closeOnSelect: true`）。

## 自定义

`items` 数组顺序即渲染顺序，支持重新排序、增删：

```ts title="src/config/fabConfig.ts"
items: [
  { type: "top", enable: true },
  { type: "home", enable: true, onlySubPages: true },
  {
    type: "toc",
    enable: true,
    devices: ["mobile", "tablet", "desktop"],  // 桌面端也显示悬浮目录
    pages: ["post"],
    depth: 2,
    closeOnSelect: false,
  },
]
```

## 零额外负担要点

- 评论按钮：评论系统未开启或文章关闭评论时，按钮产物为 0 DOM，零多余请求
- FAB 刻意**不集成音乐播放器**——避免与侧栏 `MusicSidebar` 双重状态混乱及包体积膨胀
- 架构规范见主题仓库 `docs/fab-system.md`

## 实战示例

**极简（只留返回顶部）**

```ts title="src/config/fabConfig.ts"
items: [{ type: "top", enable: true }],
```

**全端目录跟随**

```ts title="src/config/fabConfig.ts"
items: [
  { type: "top", enable: true },
  { type: "toc", enable: true, pages: ["post"], depth: 3, closeOnSelect: true },
  { type: "comment", enable: true, pages: ["post"] },
]
```

## 常见问题

::: collapse
- 悬浮目录在桌面端不见了

  默认 `devices: ["mobile", "tablet"]`——桌面端由侧栏粘性 TOC 承担。需要桌面悬浮目录时把 `desktop` 加入 `devices`。

- comment 按钮没出现

  三层检查：`fabConfig` 中按钮 `enable` → `commentConfig.enable` 全局开关（见[评论系统](/guide/article/comments/)）→ 当前页面是否在 `pages` 范围内。评论关闭时按钮零 DOM 是设计行为。

- 返回顶部按钮不出现

  滚动位置未超过横幅高度阈值。文章较短、一屏内时按钮保持隐藏。
:::
