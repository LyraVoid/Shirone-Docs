---
title: Navigation & Overlay Atoms
createTime: 2026/09/01 01:45:00
permalink: /en/guide/api/components/overlay-nav/
---

Navigation and overlay atoms govern route transitions, popup menus, modal dialogs, global snackbar notifications, and tooltip popovers, featuring built-in focus traps and keyboard accessibility.

---

## Menu <Badge text="Svelte 5" color="#ff3e00" vertical="middle" /> <Badge text="Focus Trap" type="tip" vertical="middle" />

**Path**: `src/components/atoms/navigation/Menu.svelte`  
**Purpose**: Dropdown context menu with anchor-relative positioning, arrow-key navigation, and shortcut triggers.

### Props Specification

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
  open?: boolean;
  items: MenuItem[];
  align?: "start" | "end" | "center";
  onclose?: () => void;
}
```

---

## Tabs <Badge text="Svelte 5" color="#ff3e00" vertical="middle" /> <Badge text="Spring Indicator" type="tip" vertical="middle" />

**Path**: `src/components/atoms/navigation/Tabs.svelte`  
**Purpose**: Navigation tabs component featuring smooth sliding underline indicator animations and horizontal scroll overflows.

### Props Specification

```ts
interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number | string;
}

interface TabsProps {
  activeId: string;
  tabs: TabItem[];
  variant?: "primary" | "secondary";
  onchange?: (id: string) => void;
}
```

---

## Dialog & AlertDialog <Badge text="HTMLDialog" color="#8b5cf6" vertical="middle" /> <Badge text="Modal" type="warning" vertical="middle" />

**Path**: `src/components/atoms/overlay/Dialog.svelte` & `AlertDialog.svelte`  
**Purpose**: Modal dialogs and confirmation alerts adhering to M3 28px extra-large corners (`--shape-corner-xl`) and Level 3 elevation.

### Props Specification

```ts
interface DialogProps {
  open: boolean;
  headline?: string;
  icon?: string;
  dismissible?: boolean;
  onclose?: () => void;
  children?: import("svelte").Snippet;
  actions?: import("svelte").Snippet;
}
```

### Accessibility Highlights

- **Focus Trap**: Traps keyboard focus inside the dialog when open, preventing Tab key bleed.
- **Escape Key Listener**: Closes gracefully upon pressing the Escape key.
- **Scroll Lock**: Locks body scroll while mounted to avoid dual scroll on mobile devices.

---

## Snackbar <Badge text="Svelte 5" color="#ff3e00" vertical="middle" /> <Badge text="Feedback" type="info" vertical="middle" />

**Path**: `src/components/atoms/overlay/Snackbar.svelte`  
**Purpose**: Transient bottom notification banner for async action completion (copying link, toggling theme).

### Props Specification

```ts
interface SnackbarProps {
  message: string;
  duration?: number;
  actionLabel?: string;
  onaction?: () => void;
  onclose?: () => void;
}
```

---

## Tooltip <Badge text="Svelte 5" color="#ff3e00" vertical="middle" /> <Badge text="Positioning" type="info" vertical="middle" />

**Path**: `src/components/atoms/overlay/Tooltip.svelte`  
**Purpose**: Hover/focus information bubble for icon actions, social media links, and chart controls.

### Props Specification

```ts
interface TooltipProps {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  children?: import("svelte").Snippet;
}
```

---

## BottomSheet & NavigationDrawer <Badge text="Responsive" type="tip" vertical="middle" />

**Path**: `src/components/atoms/overlay/BottomSheet.svelte` & `NavigationDrawer.svelte`  
**Purpose**: Mobile bottom sheets and sliding side drawers supporting touch gesture dismissals and spring physics.
