---
title: Action & Interaction Atoms
createTime: 2026/09/01 01:30:00
permalink: /en/guide/api/components/actions/
---

Action atoms drive all primary user triggers across the site, strictly adhering to Material 3 Expressive interaction patterns and accessibility semantics.

---

## Button

**Path**: `src/components/atoms/action/Button.svelte`  
**Purpose**: Official M3E button primitive, supporting five variants, five size scales, and automatic link semantics.

### Props Specification

```ts
interface ButtonProps {
  /** Slot content (takes precedence over label) */
  children?: import("svelte").Snippet;
  /** Button text label */
  label?: string;
  /** Leading icon name (Iconify format) */
  icon?: string;
  /** Variant (default: "filled") */
  variant?: "filled" | "elevated" | "tonal" | "outlined" | "text";
  /** Size scale (default: "small") */
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge";
  /** Expand to fill container width */
  full?: boolean;
  /** Content alignment (default: "center") */
  align?: "center" | "start" | "between";
  /** Accessible label (A11y) */
  ariaLabel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Native button type */
  type?: "button" | "submit" | "reset";
  /** When provided, renders as an <a> element with all button visuals intact */
  href?: string;
  target?: string;
  rel?: string;
  onclick?: () => void;
  /** Border radius token override ("m" | "l" | "xl" | "full" or CSS length) */
  radius?: string;
  class?: string;
  style?: string;
}
```

### Visual Variants Hierarchy

| Variant | Container Fill | Text / Icon Color | Elevation | Recommended Usage |
| --- | --- | --- | --- | --- |
| `filled` | `var(--primary)` | `var(--on-primary)` | Level 0 → Hover Level 1 | Highest emphasis, primary submit actions |
| `elevated` | `var(--surface-container-low)` | `var(--primary)` | Level 1 → Hover Level 2 | Medium-high emphasis requiring separation from complex backgrounds |
| `tonal` | `var(--secondary-container)` | `var(--on-secondary-container)` | Level 0 → Hover Level 1 | Medium emphasis actions (categories, filters) |
| `outlined` | Transparent (`1px outline-variant`) | `var(--primary)` | Level 0 | Secondary actions (back, clear) |
| `text` | Transparent | `var(--primary)` | Level 0 | Low emphasis toolbar actions and dialog cancellations |

---

## IconButton

**Path**: `src/components/atoms/action/IconButton.svelte`  
**Purpose**: Compact circular icon trigger for toolbars, floating controls, and audio player triggers.

### Props Specification

```ts
interface IconButtonProps {
  icon?: string;
  children?: import("svelte").Snippet;
  variant?: "standard" | "filled" | "tonal" | "outlined";
  size?: "small" | "medium" | "large";
  selected?: boolean;
  toggle?: boolean;
  href?: string;
  ariaLabel?: string;
  disabled?: boolean;
  onclick?: () => void;
}
```

---

## FAB (Floating Action Button)

**Path**: `src/components/atoms/action/FAB.svelte`  
**Purpose**: Elevated floating action button for global screen-level triggers (back to top, search, dark mode).

### Props Specification

```ts
interface FABProps {
  icon?: string;
  /** When label is passed, automatically switches to Extended FAB (pill shape) */
  label?: string;
  variant?: "primary" | "secondary" | "tertiary" | "surface";
  size?: "small" | "regular" | "large";
  lowered?: boolean;
  disabled?: boolean;
  onclick?: () => void;
  radius?: string;
}
```

---

## Chip & Chips

**Path**: `src/components/atoms/action/Chip.astro` & `Chips.svelte`  
**Purpose**: Static link capsule (zero-JS Astro SSR) alongside interactive multi/single-select filter bars (Svelte).

### Chip.astro (Static Link Capsule)

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

### Chips.svelte (Interactive Filter Group)

```ts
interface ChipsProps {
  items: Array<{ id: string; label: string; count?: number; icon?: string }>;
  selected?: string[];
  multiple?: boolean;
  onchange?: (selectedIds: string[]) => void;
}
```
