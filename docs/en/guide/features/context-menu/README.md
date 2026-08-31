---
title: Context Menu
createTime: 2026/09/01 00:50:00
permalink: /en/guide/features/context-menu/
---

The desktop context-menu enhancement adds quick actions—copy selected text, back to top, copy page link—alongside the browser's native context menu. Configured in `contextMenuConfig.ts`.

## Configuration

```ts title="src/config/contextMenuConfig.ts"
export const contextMenuConfig = withUserConfig("contextMenu", {
  enable: true,
  actions: ["copySelection", "backToTop", "sharePageLink"],
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | Feature switch (on by default) |
| `actions` | `array` | Three items | Action list; **array order = menu order** |

## Available Actions

| action | Function |
| --- | --- |
| `copySelection` | Copy the currently selected text |
| `backToTop` | Smooth-scroll back to the top |
| `sharePageLink` | Copy the current page's link |

## Customization

**Reorder**: just rearrange the `actions` array.

**Keep only some actions**:

```ts title="src/config/contextMenuConfig.ts"
{
  enable: true,
  actions: ["copySelection"],
}
```

**Disable entirely**:

```ts title="src/config/contextMenuConfig.ts"
{
  enable: false,
  actions: ["copySelection", "backToTop", "sharePageLink"],
}
```

When disabled, the browser's native context menu is restored, with **zero DOM, zero listeners, zero client resources**—the zero-overhead contract.

## Scope

Desktop only—long-press behavior on touch devices is handled by the browser and OS, unaffected by this config.

## FAQ

**The context menu didn't change**

Check that `enable` isn't off, and that you're on a desktop browser (touch devices are unaffected).

**Can I add custom actions**

Only the three built-in actions are supported for now; custom action items aren't supported yet. File an Issue in the theme repository if needed.