---
title: 操作交互原子 (Action Atoms)
createTime: 2026/09/01 01:30:00
permalink: /guide/api/components/actions/
---

操作交互原子承载站点内的所有核心用户触发行为，严格对齐 Material 3 Expressive 交互规范与无障碍语义。

---

## Button <Badge text="Svelte 5" color="#ff3e00" vertical="middle" /> <Badge text="M3 Expressive" type="tip" vertical="middle" />

**文件**：`src/components/atoms/action/Button.svelte`  
**职责**：官方 M3E 按钮移植，支持五种官方变体、五种尺寸及原生链接语义自适应。

### Props 规范

```ts
interface ButtonProps {
  /** 内容插槽（优先于 label 渲染；SSR 场景推荐传入已渲染图标） */
  children?: import("svelte").Snippet;
  /** 按钮文本 */
  label?: string;
  /** Leading 图标名称（Iconify 格式，如 "material-symbols:add-rounded"） */
  icon?: string;
  /** 变体类型（默认 "filled"） */
  variant?: "filled" | "elevated" | "tonal" | "outlined" | "text";
  /** 尺寸（默认 "small"） */
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge";
  /** 是否占满父容器宽度（默认 false） */
  full?: boolean;
  /** 内容水平对齐方式（默认 "center"） */
  align?: "center" | "start" | "between";
  /** 无障碍语义标签（A11y） */
  ariaLabel?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 原生按钮类型（默认 "button"） */
  type?: "button" | "submit" | "reset";
  /** 传入时自动渲染为原生 <a> 标签并保留所有按钮样式与状态层 */
  href?: string;
  /** 链接 target（仅 href 时生效） */
  target?: string;
  /** 链接 rel（仅 href 时生效） */
  rel?: string;
  /** 点击事件回调 */
  onclick?: () => void;
  /** 自定义圆角覆盖（支持 token 名 "m" | "l" | "xl" | "full" 或 CSS 长度） */
  radius?: string;
  class?: string;
  style?: string;
}
```

### 变体与视觉层级

| 变体 | 容器背景 | 文本与图标色 | 阴影层级 | 推荐应用场景 |
| --- | --- | --- | --- | --- |
| `filled` | `var(--primary)` | `var(--on-primary)` | Level 0 → Hover Level 1 | 页面最核心的主操作、提交表单 |
| `elevated` | `var(--surface-container-low)` | `var(--primary)` | Level 1 → Hover Level 2 | 需要在复杂背景中突出的次级操作 |
| `tonal` | `var(--secondary-container)` | `var(--on-secondary-container)` | Level 0 → Hover Level 1 | 中等重要性的操作（如文章分类选择） |
| `outlined` | 透明 (`border: 1px outline-variant`) | `var(--primary)` | Level 0 | 辅助动作（如返回、重置） |
| `text` | 透明 | `var(--primary)` | Level 0 | 工具栏按钮、对话框取消操作 |

---

## IconButton <Badge text="Svelte 5" color="#ff3e00" vertical="middle" /> <Badge text="Client" type="info" vertical="middle" />

**文件**：`src/components/atoms/action/IconButton.svelte`  
**职责**：紧凑型图标触发器，适用于顶部栏工具、浮动控制流及音乐播放器快捷按钮。

### Props 规范

```ts
interface IconButtonProps {
  /** 图标名称（Iconify） */
  icon?: string;
  /** 内容插槽（优先于 icon） */
  children?: import("svelte").Snippet;
  /** 变体类型（默认 "standard"） */
  variant?: "standard" | "filled" | "tonal" | "outlined";
  /** 尺寸（默认 "medium" 40px） */
  size?: "small" | "medium" | "large";
  /** 是否处于激活/选中状态 */
  selected?: boolean;
  /** 是否为开关型按钮（Toggle） */
  toggle?: boolean;
  /** 链接模式 URL */
  href?: string;
  /** 无障碍必填描述 */
  ariaLabel?: string;
  disabled?: boolean;
  onclick?: () => void;
}
```

---

## FAB (Floating Action Button) <Badge text="Svelte 5" color="#ff3e00" vertical="middle" /> <Badge text="Motion" type="tip" vertical="middle" />

**文件**：`src/components/atoms/action/FAB.svelte`  
**职责**：悬浮操作按钮，用于全站全局动作（如回到顶部、快捷搜索、夜间模式切换）。

### Props 规范

```ts
interface FABProps {
  /** 图标名称 */
  icon?: string;
  /** 可见文本：传入 label 时自动切换为 Extended FAB（长胶囊扩展形态） */
  label?: string;
  /** 变体：primary（默认）/ secondary / tertiary / surface */
  variant?: "primary" | "secondary" | "tertiary" | "surface";
  /** 尺寸：small (40px) / regular (56px) / large (96px) */
  size?: "small" | "regular" | "large";
  /** 降低高度模式（lowered：初始 Level 1 阴影） */
  lowered?: boolean;
  disabled?: boolean;
  onclick?: () => void;
  radius?: string;
}
```

---

## Chip & Chips <Badge text="Svelte 5" color="#ff3e00" vertical="middle" /> <Badge text="Interactive" type="info" vertical="middle" />

**文件**：`src/components/atoms/action/Chip.astro` & `Chips.svelte`  
**职责**：提供静态标签胶囊（Astro 零 JS 静态直出）与多选/单选交互过滤栏（Svelte 水合）。

### Chip.astro（静态链接胶囊）

```astro
---
interface Props {
  label: string;
  href?: string;
  icon?: string;
  count?: number;
  active?: boolean;
  variant?: "assist" | "filter" | "input" | "suggestion";
  class?: string;
}
---
```

### Chips.svelte（交互过滤组）

```ts
interface ChipsProps {
  items: Array<{ id: string; label: string; count?: number; icon?: string }>;
  selected?: string[];
  multiple?: boolean;
  onchange?: (selectedIds: string[]) => void;
}
```
