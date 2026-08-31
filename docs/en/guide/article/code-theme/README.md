---
title: Code Block Themes
createTime: 2026/09/01 00:14:00
permalink: /en/guide/article/code-theme/
---

Post code block syntax highlighting is powered by Expressive Code, with light and dark themes configured in `expressiveCodeConfig.ts`, switching automatically with the site's dark mode.

## Configuration

```ts title="src/config/expressiveCodeConfig.ts"
export const expressiveCodeConfig = withUserConfig("expressiveCode", {
  theme: "github-dark",
  lightTheme: "github-light",
  darkTheme: "github-dark",
})
```

| Field | Default | Description |
| --- | --- | --- |
| `theme` | `github-dark` | Base theme (fallback for compatibility scenarios) |
| `lightTheme` | `github-light` | Code theme in light mode |
| `darkTheme` | `github-dark` | Code theme in dark mode |

The build generates styles for both light and dark themes; pages switch automatically with the visitor's mode choice—no client scripts involved.

## Available Themes

Theme names come from the Shiki theme library. Popular choices:

| Theme | Style |
| --- | --- |
| `github-light` / `github-dark` | Default. GitHub style, neutral and readable |
| `catppuccin-latte` / `catppuccin-mocha` | Soft macaron palette, fits anime aesthetics |
| `one-light` / `one-dark-pro` | Classic editor style |
| `dracula` | High-saturation purple |
| `rose-pine-dawn` / `rose-pine` | Low-saturation rose tones |
| `vitesse-light` / `vitesse-dark` | Low-contrast, easy on the eyes |

For the full list see the Expressive Code / Shiki theme documentation.

## Pairing Suggestions

**Echo the site's colors (recommended for anime sites)**

```ts title="src/config/expressiveCodeConfig.ts"
{
  theme: "catppuccin-mocha",
  lightTheme: "catppuccin-latte",
  darkTheme: "catppuccin-mocha",
}
```

**Low-contrast comfort combo**

```ts title="src/config/expressiveCodeConfig.ts"
{
  theme: "vitesse-dark",
  lightTheme: "vitesse-light",
  darkTheme: "vitesse-dark",
}
```

::: tip Relation to Dynamic Colors
Code block themes are **fixed palettes** and do not participate in HCT dynamic coloring—changing `themeColor.hue` does not alter code highlight colors. For visual harmony, pick a Shiki theme close to your site's seed color (e.g. rose-pine themes for pink/purple sites).
:::

## Related Reading

Code block syntax capabilities (file trees, code trees, line decorations, collapsing) are covered in [Code Display](/en/guide/writing/code/) in the Writing section; this page is only about color themes.

## FAQ

::: collapse
- The theme change has no effect
  Theme names must exactly match the Shiki registered names (case-sensitive). The build generates styles for both modes—confirm you rebuilt before checking.

- The code block background clashes with the card background
  Some styles (like background color) have override logic in `astro.config.mjs` (noted in source comments). If backgrounds mismatch after customizing, check whether the overrides in that file need updating too.

- Can code blocks follow the theme color
  Not currently—Shiki themes are static palettes. Workaround: pick a neutral theme (`github-*`, `vitesse-*`) so code blocks look fine under any site color scheme.
:::
