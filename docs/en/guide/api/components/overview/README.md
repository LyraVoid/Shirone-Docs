---
title: Component Design Contract & Architecture
createTime: 2026/09/01 01:25:00
permalink: /en/guide/api/components/overview/
---

Shirone's component system is built upon **Material 3 Expressive (M3E)** guidelines and the **Atomic Design** hierarchical model, engineered for a modern, anime-editorial static blogging experience.

Every component adheres to strict engineering contracts covering code implementation, design token consumption, lifecycle management, and accessibility (A11y).

## 1. Architectural Hierarchy

```text
┌─────────────────────────────────────────────────────────────┐
│                    Pages & Layouts                          │
│        (Route Pages, Page Shells, Swup Containers, SSR)     │
├─────────────────────────────────────────────────────────────┤
│                       Organisms                             │
│     (Domain Modules: AnimeSection, MusicSidebar, TopAppBar) │
├─────────────────────────────────────────────────────────────┤
│                       Molecules                             │
│       (Composite Structures: SearchBar, BreadcrumbNav)      │
├─────────────────────────────────────────────────────────────┤
│                         Atoms                               │
│  (Design Primitives: Button, Card, TextField, Badge, FAB)   │
├─────────────────────────────────────────────────────────────┤
│                     Design Tokens                           │
│  (M3E Tokens: Dynamic HCT, Spacing, Shapes, Shadows, Motion)│
└─────────────────────────────────────────────────────────────┘
```

- **Atoms**: Minimal, indivisible UI building blocks that consume Design Tokens unidirectionally without business logic or network requests.
- **Organisms**: Complex feature modules responsible for state orchestration, i18n injection, and SPA route synchronization.
- **System**: Global runtime foundations (configuration carrier, global stylesheets, dynamic color engine, analytics runtime).

## 2. Rendering Models & Boundary Rules

Shirone maintains a **zero-unnecessary-JS** architecture, strictly distinguishing between Astro SSR components and Svelte 5 hydrated components:

| Type | Stack | Target Use Case | Contract Constraints |
| --- | --- | --- | --- |
| **Static Display Components** | Astro (`.astro`) | Post cards, metadata bars, sidebar frame, footer, tags | Pure SSR with zero client runtime JS overhead |
| **Interactive Controls** | Svelte 5 (`.svelte`) | Buttons, inputs, music player controllers, dialogs, sliders | Built with Svelte 5 Runes (`$props()`, `$state()`, `$derived()`, `$bindable()`); on-demand hydration |

## 3. Design Tokens & CSS Variable Contracts

Hardcoded pixel units (px), raw hex colors, and arbitrary border-radii are strictly prohibited in component styles. All styling must consume standard tokens:

### Dynamic HCT Color Tokens

- Primary: `var(--primary)` / `var(--primary-container)` / `var(--on-primary)` / `var(--on-primary-container)`
- Secondary: `var(--secondary)` / `var(--secondary-container)` / `var(--on-secondary)` / `var(--on-secondary-container)`
- Surface & Containers: `var(--surface)` / `var(--surface-container-low)` / `var(--surface-container)` / `var(--surface-container-high)` / `var(--surface-container-highest)`
- Text & Outlines: `var(--on-surface)` / `var(--on-surface-variant)` / `var(--outline)` / `var(--outline-variant)`

### Shape & Corner Contracts

- Compact / Small Controls (XS/SM): `var(--shape-corner-xs)` (4px) / `var(--shape-corner-s)` (8px)
- Standard Controls & Cards (M): `var(--shape-corner-m)` (12px) — default baseline for buttons and inputs
- Large Containers & FABs (L): `var(--shape-corner-l)` (16px)
- Dialogs & Sheets (XL): `var(--shape-corner-xl)` (28px)
- Capsules & Indicators (Full): `var(--shape-corner-full)` (9999px) — chips, badges, segmented pills

### Elevation Levels

- Level 0: `none`
- Level 1: `var(--m3e-elevation-1)`
- Level 2: `var(--m3e-elevation-2)`
- Level 3: `var(--m3e-elevation-3)`
- Level 4: `var(--m3e-elevation-4)`
- Level 5: `var(--m3e-elevation-5)`

## 4. State Layer Contract (`.m3-state-layer`)

All interactive elements inherit the `.m3-state-layer` color-mix pattern for hover, focus, and pressed feedback:

- Hover: `8%` overlay opacity
- Focus-Visible: `12%` overlay opacity with standard 2px focus ring
- Pressed/Active: `12%` overlay opacity

## 5. Swup SPA Lifecycle & Singleton Contracts

Components mounted inside the persistent shell (such as sidebar player, header app bar, theme toggle) **are never destroyed or remounted** during Swup SPA navigation:

1. **Cleanup**: Event listeners bound in Svelte `$effect` must return explicit teardown functions.
2. **Lifecycle Sync**: Components responding to route changes must listen to `swup:content:replace` and `swup:page:view` events.
3. **Isolation**: Article-embedded facades (e.g. Bilibili embed) must isolate state inside their DOM container without polluting global scopes.
