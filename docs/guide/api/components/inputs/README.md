---
title: 输入与选择原子 (Input & Selection Atoms)
createTime: 2026/09/01 01:35:00
permalink: /guide/api/components/inputs/
---

输入与选择原子涵盖表单录入、状态切换、数值调节及搜索交互控件，支持 Svelte 5 `$bindable()` 双向状态绑定与无障碍（A11y）标准。

---

## TextField

**文件**：`src/components/atoms/input/TextField.svelte`  
**职责**：文本输入框，支持 Filled 与 Outlined 两种官方形态、浮动标签、首尾图标、字数统计与校验错误提示。

### Props 规范

```ts
interface TextFieldProps {
  /** 输入值（支持 $bindable 双向绑定） */
  value?: string;
  /** 占位符提示 */
  placeholder?: string;
  /** 浮动标签文本（Floating Label） */
  label?: string;
  /** 变体形态：filled（默认，带底色）/ outlined（线框） */
  variant?: "filled" | "outlined";
  /** 输入类型：text / password / email / number / url */
  type?: string;
  /** 首部图标名称（Iconify） */
  leadingIcon?: string;
  /** 尾部图标名称（Iconify） */
  trailingIcon?: string;
  /** 底部辅助说明文字 */
  supportingText?: string;
  /** 校验错误信息（传入时自动触发红色 Error 状态与振动反馈） */
  errorMessage?: string;
  /** 最大字符数限制（开启后右下角展示字数计数器） */
  maxlength?: number;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  oninput?: (e: Event) => void;
  onchange?: (e: Event) => void;
}
```

---

## Select

**文件**：`src/components/atoms/input/Select.svelte`  
**职责**：下拉选择框，支持单选、预设高亮、自定义 Option 渲染与键盘上下键导航。

### Props 规范

```ts
interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface SelectProps {
  /** 当前选中的值（支持 $bindable） */
  value?: string | number;
  /** 选项列表 */
  options: SelectOption[];
  /** 占位提示 */
  placeholder?: string;
  /** 变体：filled / outlined */
  variant?: "filled" | "outlined";
  disabled?: boolean;
  onchange?: (value: string | number) => void;
}
```

---

## SearchBar

**文件**：`src/components/atoms/input/SearchBar.svelte`  
**职责**：站内全局与面板搜索输入框，内置防抖、快捷键监听（如 `/` 或 `Ctrl+K`）与一键清空按钮。

### Props 规范

```ts
interface SearchBarProps {
  /** 搜索关键词（支持 $bindable） */
  query?: string;
  placeholder?: string;
  /** 防抖延迟毫秒数（默认 200ms） */
  debounceMs?: number;
  /** 是否展示右侧快捷键提示卡（如 "Ctrl K"） */
  showShortcut?: boolean;
  onsearch?: (query: string) => void;
  onclear?: () => void;
}
```

---

## Switch

**文件**：`src/components/atoms/selection/Switch.svelte`  
**职责**：二元状态开关，遵循 M3 触点（Thumb）与轨道（Track）几何规范，支持可选内嵌图标。

### Props 规范

```ts
interface SwitchProps {
  /** 开关状态（支持 $bindable） */
  checked?: boolean;
  /** 激活态 Thumb 内嵌图标 */
  checkedIcon?: string;
  /** 未激活态 Thumb 内嵌图标 */
  uncheckedIcon?: string;
  disabled?: boolean;
  ariaLabel?: string;
  onchange?: (checked: boolean) => void;
}
```

---

## Slider

**文件**：`src/components/atoms/selection/Slider.svelte`  
**职责**：连续与离散数值调节滑块（用于音乐播放器进度/音量调节、阅读字号缩放）。

### Props 规范

```ts
interface SliderProps {
  /** 当前数值（支持 $bindable） */
  value?: number;
  /** 最小值（默认 0） */
  min?: number;
  /** 最大值（默认 100） */
  max?: number;
  /** 步长（默认 1） */
  step?: number;
  /** 是否展示当前数值指示气泡（Value Indicator） */
  showIndicator?: boolean;
  disabled?: boolean;
  onchange?: (value: number) => void;
}
```

---

## SegmentedButton

**文件**：`src/components/atoms/selection/SegmentedButton.svelte`  
**职责**：胶囊分段单选控制器，用于视图模式切换（网格/列表）与归档时间轴跨度选择。

### Props 规范

```ts
interface SegmentItem {
  id: string;
  label: string;
  icon?: string;
}

interface SegmentedButtonProps {
  /** 选中的项 ID（支持 $bindable） */
  selectedId: string;
  /** 选项列表 */
  items: SegmentItem[];
  disabled?: boolean;
  onchange?: (id: string) => void;
}
```
