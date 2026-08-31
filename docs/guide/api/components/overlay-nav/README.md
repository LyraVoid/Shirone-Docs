---
title: 导航与浮层原子 (Navigation & Overlay Atoms)
createTime: 2026/09/01 01:45:00
permalink: /guide/api/components/overlay-nav/
---

导航与浮层原子负责处理页面路由切换、菜单弹出、模态对话框、全局消息通知与气泡提示，内置焦点陷阱（Focus Trap）与键盘无障碍交互。

---

## Menu

**文件**：`src/components/atoms/navigation/Menu.svelte`  
**职责**：下拉浮动菜单，支持基于锚点元素的精确定位、键盘方向键导航与快捷键触发。

### Props 规范

```ts
interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onclick?: () => void;
}

interface MenuProps {
  /** 菜单是否展开（支持 $bindable） */
  open?: boolean;
  /** 菜单项列表 */
  items: MenuItem[];
  /** 锚点对齐方式：start / end / center */
  align?: "start" | "end" | "center";
  onclose?: () => void;
}
```

---

## Tabs

**文件**：`src/components/atoms/navigation/Tabs.svelte`  
**职责**：导航选项卡组，带有基于 CSS 变量计算的平滑滑动指示线（Indicator）与横向滚动支持。

### Props 规范

```ts
interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number | string;
}

interface TabsProps {
  /** 当前激活的 Tab ID（支持 $bindable） */
  activeId: string;
  tabs: TabItem[];
  /** 变体：primary（主导航）/ secondary（子栏目） */
  variant?: "primary" | "secondary";
  onchange?: (id: string) => void;
}
```

---

## Dialog & AlertDialog

**文件**：`src/components/atoms/overlay/Dialog.svelte` & `AlertDialog.svelte`  
**职责**：模态对话框与确认警示弹窗，遵循 M3 28px 超大圆角（`--shape-corner-xl`）与 Level 3 阴影层级。

### Props 规范

```ts
interface DialogProps {
  /** 是否显示（支持 $bindable） */
  open: boolean;
  /** 标题 */
  headline?: string;
  /** 顶部图标 */
  icon?: string;
  /** 允许点击背景遮罩关闭 */
  dismissible?: boolean;
  onclose?: () => void;
  children?: import("svelte").Snippet;
  actions?: import("svelte").Snippet;
}
```

### 特性与无障碍保障

- **焦点捕获**：打开时自动锁定焦点在弹窗内部，防止 Tab 键穿透至底层背景。
- **Esc 键监听**：原生支持按下 Esc 键平滑关闭弹窗。
- **滚动穿透防护**：开启时锁定 `body` 滚动条，避免移动端滚动穿透。

---

## Snackbar

**文件**：`src/components/atoms/overlay/Snackbar.svelte`  
**职责**：屏幕底部全局轻量消息浮条，用于异步操作完成反馈（如复制链接成功、切换主题提示）。

### Props 规范

```ts
interface SnackbarProps {
  /** 消息内容 */
  message: string;
  /** 显示时长毫秒数（默认 4000ms） */
  duration?: number;
  /** 可选操作按钮文字（如 "撤销"） */
  actionLabel?: string;
  onaction?: () => void;
  onclose?: () => void;
}
```

---

## Tooltip

**文件**：`src/components/atoms/overlay/Tooltip.svelte`  
**职责**：悬浮说明气泡，用于解释图标按钮含义、社交链接及 Mermaid 图表缩放按钮。

### Props 规范

```ts
interface TooltipProps {
  /** 提示文本 */
  text: string;
  /** 弹出方位：top / bottom / left / right（默认 "top"） */
  position?: "top" | "bottom" | "left" | "right";
  /** 触发延迟毫秒数（默认 300ms） */
  delayMs?: number;
  children?: import("svelte").Snippet;
}
```

---

## BottomSheet & NavigationDrawer

**文件**：`src/components/atoms/overlay/BottomSheet.svelte` & `NavigationDrawer.svelte`  
**职责**：移动端底部弹板与全屏抽屉，支持手势下拉关闭与弹性阻尼动效。
