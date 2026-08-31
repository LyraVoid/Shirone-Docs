---
title: Shell & Sidebar Widgets
createTime: 2026/09/01 02:00:00
permalink: /en/guide/api/components/shell-widgets/
---

Global shell and sidebar widgets form the persistent backbone of the Shirone site. Mounted directly within the primary layout shell, they remain active across Swup SPA transitions to ensure seamless audio playback, global navigation, and theme persistence.

---

## TopAppBar

**Path**: `src/components/organisms/TopAppBar.astro`  
**Purpose**: Primary navigation bar containing site logo, main navigation routes, search modal trigger, dark mode toggle, and mobile navigation drawer trigger.

### Scroll Response Contract

- **Top Baseline**: Transparent background blending into BannerStage.
- **Scrolled (> 60px)**: Automatically elevates with a translucent container fill (`--surface-container`), backdrop blur (`backdrop-filter: blur(12px)`), and Level 2 shadow.

---

## SideBar

**Path**: `src/components/organisms/SideBar.astro`  
**Purpose**: Persistent sidebar container dynamically assembling profile cards, music player, categories, tags, announcements, and Umami statistics based on `sidebarConfig.ts`.

### Zero-Footprint Guarantee

- Disabled widgets emit zero DOM elements.
- Disabled features are eliminated during static build tree-shaking, imposing zero runtime script or network overhead.

---

## MusicSidebar & MusicSidebarClient

**Path**: `src/components/organisms/music/MusicSidebar.astro` & `MusicSidebarClient.svelte`  
**Purpose**: Sidebar audio player subsystem. The outer Astro shell outputs an SSR skeleton while the inner Svelte singleton manages audio lifecycles and Meting cloud playlist fetching.

### Core Capabilities

- **Continuous Playback**: Mounted outside Swup's dynamic container, ensuring music **never stops** during page navigation.
- **Hybrid Resilience (`mixed`)**: Instant local audio startup with background Meting expansion and silent network fallback.
- **Media Session Integration**: Synchronizes playback state, album art, and track info with OS-level lock screen media controls.

---

## UmamiStats & UmamiRuntime

**Path**: `src/components/organisms/UmamiStats.astro` & `src/components/system/UmamiRuntime.astro`  
**Purpose**:
- `UmamiStats.astro`: Renders public view counter slots (`profile` card mode or article `meta` mode).
- `UmamiRuntime.astro`: Injects the global request coalesce pool and updates metrics on Swup route transitions.

---

## DisplaySettings & LightDarkSwitch

**Path**: `src/components/organisms/DisplaySettings.svelte` & `LightDarkSwitch.svelte`  
**Purpose**:
- `DisplaySettings`: Control panel for dynamic HCT seed hue picking, wallpaper blur intensity, and typography adjustments.
- `LightDarkSwitch`: One-click dark/light mode toggle with smooth sun-to-moon icon morphing.

---

## ContextMenu

**Path**: `src/components/organisms/ContextMenu.svelte`  
**Purpose**: Enhanced right-click context menu offering shortcuts for copying, sharing, back-to-top, random article jump, and theme toggling.

---

## RouteProgress

**Path**: `src/components/organisms/RouteProgress.svelte`  
**Purpose**: Top loading progress bar synchronized with Swup navigation lifecycle events with Material 3 emphasized deceleration curves.
