---
title: 组件设计规范与架构契约
createTime: 2026/09/01 01:25:00
permalink: /guide/api/components/overview/
---

Shirone 的组件系统建立在 ==**Material 3 Expressive (M3E)**== 规范与 ==**Atomic Design**== 分层模型之上，服务于动漫风格的现代化静态博客体验。

所有组件在代码实现、样式消费、生命周期管理与无障碍（A11y）上均遵循严格的工程化契约。

## 1. 架构分层体系

```text
┌─────────────────────────────────────────────────────────────┐
│                    Pages & Layouts                          │
│        (路由页面、页面骨架、Swup 容器、SSR 数据装配)            │
├─────────────────────────────────────────────────────────────┤
│                       Organisms                             │
│     (业务实体/页面模块: AnimeSection, MusicSidebar, TopAppBar)   │
├─────────────────────────────────────────────────────────────┤
│                       Molecules                             │
│       (简单组合结构: SearchBar, BreadcrumbNavigation)        │
├─────────────────────────────────────────────────────────────┤
│                         Atoms                               │
│  (设计基石: Button, Card, TextField, Badge, Skeleton, FAB)   │
├─────────────────────────────────────────────────────────────┤
│                     Design Tokens                           │
│  (M3E 令牌: HCT 动态色、间距基准、圆角规范、阴影层级、缓动动效)   │
└─────────────────────────────────────────────────────────────┘
```

- **Atoms（原子）**：最小不可分割的交互与展示单元，单向消费 Design Tokens，严禁包含业务实体逻辑与网络回源。
- **Organisms（有机体/模块）**：具备完整业务功能和状态管理的聚合体，负责数据编排、多语言国际化（i18n）注入与 SPA 切页事件同步。
- **System（系统运行时）**：全局注入的无感基础设施（配置载体、全局样式、动态色引擎与分析运行时）。

## 2. 渲染模型与技术选型边界

Shirone 遵循**零多余 JavaScript** 的极简构建哲学，严格区分 Astro 静态直出与 Svelte 5 客户端水合：

| 类型 | 技术栈 | 适用场景 | 契约约束 |
| --- | --- | --- | --- |
| **静态展示组件** | Astro (`.astro`) | 文章卡片、元数据条、侧栏容器、页脚、标签列表等 | 纯 SSR 零运行时 JS 直出，首屏秒开，搜索引擎友好 |
| **交互控制组件** | Svelte 5 (`.svelte`) | 按钮、输入框、播放器控制器、弹窗抽屉、滑块等 | 使用 Svelte 5 Runes（`$props()`, `$state()`, `$derived()`, `$bindable()`）；按需水合（`client:load` / `client:idle` / `client:visible`） |

## 3. Design Tokens 与 CSS 变量契约

所有组件严禁在内部样式硬编码像素（px）、十六进制色值或非标准圆角。必须严格引用以下 CSS 变量：

### 动态色彩体系 (HCT Tonal System)

- 主色调：`var(--primary)` / `var(--primary-container)` / `var(--on-primary)` / `var(--on-primary-container)`
- 次色调：`var(--secondary)` / `var(--secondary-container)` / `var(--on-secondary)` / `var(--on-secondary-container)`
- 表面与容器色：`var(--surface)` / `var(--surface-container-low)` / `var(--surface-container)` / `var(--surface-container-high)` / `var(--surface-container-highest)`
- 文本与边框：`var(--on-surface)` / `var(--on-surface-variant)` / `var(--outline)` / `var(--outline-variant)`

### 形状与圆角契约

- 紧凑/小控件（XS/SM）：`var(--shape-corner-xs)` (4px) / `var(--shape-corner-s)` (8px)
- 控件与普通卡片（M）：`var(--shape-corner-m)` (12px) —— 按钮、输入框、卡片默认基准
- 大卡片与浮层（L）：`var(--shape-corner-l)` (16px) —— FAB、大容器
- 弹窗与抽屉（XL）：`var(--shape-corner-xl)` (28px) —— Dialog、BottomSheet
- 胶囊/指示器（Full）：`var(--shape-corner-full)` (9999px) —— Chips、Badges、Pills

### 阴影层级 (Elevation)

- Level 0: `none`
- Level 1: `var(--m3e-elevation-1)`
- Level 2: `var(--m3e-elevation-2)`
- Level 3: `var(--m3e-elevation-3)`
- Level 4: `var(--m3e-elevation-4)`
- Level 5: `var(--m3e-elevation-5)`

## 4. 状态层规范 (`.m3-state-layer`)

所有交互式控件（按钮、卡片、列表项、选项卡）统一继承 `.m3-state-layer` 混色方案：

```stylus
.m3-state-layer
  position: relative
  overflow: hidden
  -webkit-tap-highlight-color: transparent

  &::before
    content: ""
    position: absolute
    inset: 0
    background-color: var(--m3e-state-color, var(--on-surface))
    opacity: 0
    transition: opacity var(--m3e-duration-short) var(--m3e-easing-standard)
    pointer-events: none

  &:hover::before
    opacity: 0.08

  &:focus-visible::before
    opacity: 0.12

  &:active::before
    opacity: 0.12
```

## 5. Swup SPA 生命周期与单例契约

挂载在持久外壳（如侧栏播放器、顶部导航栏、主题切换开关）中的组件在 Swup 无刷新切页时**不会被销毁重建**。因此：

1. **事件清理**：在 Svelte `$effect` 中绑定的 `window` / `document` 事件必须返回清理函数。
2. **生命周期监听**：需要随页面路由变动的组件，必须主动监听 `swup:content:replace` 与 `swup:page:view` 事件以同步数据。
3. **零状态残留**：文章内的嵌入式小组件（如 Bilibili 门面）必须隔离在其容器 DOM 内，不可依赖跨页面的全局可变状态。
