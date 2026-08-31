---
title: Display & Feedback Atoms
createTime: 2026/09/01 01:40:00
permalink: /en/guide/api/components/display/
---

Display and feedback atoms provide structural card containers, visual accents, badge counters, placeholder skeletons, and asynchronous loading indicators.

---

## Card

**Path**: `src/components/atoms/display/Card.svelte`  
**Purpose**: Official M3E card container primitive, providing three visual variants and automatically resolving into link cards (`<a>`), clickable action cards (`<button>`), or static containers (`<div>`).

### Props Specification

```ts
interface CardProps {
  /** Variant: "filled" (default), "elevated" (Level 1 elevation), "outlined" (border) */
  variant?: "filled" | "elevated" | "outlined";
  /** Renders as an <a> card link when supplied; highest precedence */
  href?: string;
  target?: string | null;
  /** Click callback; renders as a <button> interactive card when supplied without href */
  onClick?: (e: MouseEvent) => void;
  /** Whether the interactive card is enabled (false disables clicks and dims visual opacity) */
  enabled?: boolean;
  /** Background color override */
  color?: string;
  /** Radius token override ("m" | "l" | "xl" | "full" or CSS length) */
  radius?: string;
  /** Root element ID */
  id?: string;
  class?: string;
  children?: import("svelte").Snippet;
}
```

---

## Avatar

**Path**: `src/components/atoms/display/Avatar.svelte`  
**Purpose**: Profile and author avatar primitive supporting lazy loading, text fallback, and dynamic color bloom rings.

### Props Specification

```ts
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number | string;
  fallbackText?: string;
  glow?: boolean;
}
```

---

## Icon & MetaIcon

**Path**: `src/components/atoms/display/Icon.svelte` & `MetaIcon.astro`  
**Purpose**:
- `Icon.svelte`: Offline Iconify renderer that never requests external network APIs at runtime; all iconography is compiled into the site bundle.
- `MetaIcon.astro`: Zero-JS server-rendered icon for static pages.

---

## Badge & BadgedBox

**Path**: `src/components/atoms/display/Badge.svelte` & `BadgedBox.svelte`  
**Purpose**: Status badges and attached indicator counters for unread counts, tags, and pin flags.

### Props Specification

```ts
interface BadgeProps {
  value?: string | number;
  max?: number;
  variant?: "primary" | "error" | "secondary";
  dot?: boolean;
}
```

---

## Skeleton

**Path**: `src/components/atoms/display/Skeleton.svelte`  
**Purpose**: Placeholder loading skeleton featuring gentle Material 3 shimmer animations.

### Props Specification

```ts
interface SkeletonProps {
  variant?: "text" | "rect" | "circle";
  width?: string;
  height?: string;
  lines?: number;
  class?: string;
}
```

---

## LoadingIndicator

**Path**: `src/components/atoms/feedback/LoadingIndicator.svelte`  
**Purpose**: Expressive morphing loader based on `loadingShapes.ts` cubic bezier interpolation between star, polygon, square, and circle shapes.

### Props Specification

```ts
interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "on-surface";
  label?: string;
}
```

---

## ProgressIndicator

**Path**: `src/components/atoms/feedback/ProgressIndicator.svelte`  
**Purpose**: Linear and circular progress bars supporting both determinate (0–100) and indeterminate animation modes.
