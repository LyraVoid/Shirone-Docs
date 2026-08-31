---
title: Input & Selection Atoms
createTime: 2026/09/01 01:35:00
permalink: /en/guide/api/components/inputs/
---

Input and selection atoms govern text entry, state toggles, scalar adjustments, and search interfaces, fully supporting Svelte 5 `$bindable()` two-way state and accessibility standards.

---

## TextField

**Path**: `src/components/atoms/input/TextField.svelte`  
**Purpose**: Versatile text entry field supporting Filled and Outlined variants, floating labels, leading/trailing icons, character counter, and validation states.

### Props Specification

```ts
interface TextFieldProps {
  /** Value string (supports $bindable) */
  value?: string;
  /** Placeholder hint */
  placeholder?: string;
  /** Floating label text */
  label?: string;
  /** Variant style: "filled" (default) or "outlined" */
  variant?: "filled" | "outlined";
  /** Input type: text, password, email, number, url */
  type?: string;
  /** Leading icon name (Iconify) */
  leadingIcon?: string;
  /** Trailing icon name (Iconify) */
  trailingIcon?: string;
  /** Bottom supporting text */
  supportingText?: string;
  /** Error message (triggers error state and color shift) */
  errorMessage?: string;
  /** Maximum length restriction (displays character counter) */
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

**Path**: `src/components/atoms/input/Select.svelte`  
**Purpose**: Dropdown selection menu with keyboard navigation and option customization.

### Props Specification

```ts
interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface SelectProps {
  value?: string | number;
  options: SelectOption[];
  placeholder?: string;
  variant?: "filled" | "outlined";
  disabled?: boolean;
  onchange?: (value: string | number) => void;
}
```

---

## SearchBar

**Path**: `src/components/atoms/input/SearchBar.svelte`  
**Purpose**: Global search field featuring debouncing, keyboard shortcuts (`/` or `Ctrl+K`), and one-click clear button.

### Props Specification

```ts
interface SearchBarProps {
  query?: string;
  placeholder?: string;
  debounceMs?: number;
  showShortcut?: boolean;
  onsearch?: (query: string) => void;
  onclear?: () => void;
}
```

---

## Switch

**Path**: `src/components/atoms/selection/Switch.svelte`  
**Purpose**: Binary state toggle adhering to M3 thumb and track geometric specifications with optional inline icons.

### Props Specification

```ts
interface SwitchProps {
  checked?: boolean;
  checkedIcon?: string;
  uncheckedIcon?: string;
  disabled?: boolean;
  ariaLabel?: string;
  onchange?: (checked: boolean) => void;
}
```

---

## Slider

**Path**: `src/components/atoms/selection/Slider.svelte`  
**Purpose**: Continuous or discrete value range slider used for audio volume, playback seeking, and typography scaling.

### Props Specification

```ts
interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  showIndicator?: boolean;
  disabled?: boolean;
  onchange?: (value: number) => void;
}
```

---

## SegmentedButton

**Path**: `src/components/atoms/selection/SegmentedButton.svelte`  
**Purpose**: Connected pill toggle control for view modes (grid/list) and archive timescale filtering.

### Props Specification

```ts
interface SegmentItem {
  id: string;
  label: string;
  icon?: string;
}

interface SegmentedButtonProps {
  selectedId: string;
  items: SegmentItem[];
  disabled?: boolean;
  onchange?: (id: string) => void;
}
```
